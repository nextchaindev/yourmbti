import { supabase } from './supabase';
import { KakaoUser } from '../types/kakao';

export async function createOrUpdateUser(kakaoUser: KakaoUser) {
  try {
    console.log('Attempting to create/update user with data:', kakaoUser);

    // 먼저 사용자가 존재하는지 확인
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', kakaoUser.id)
      .single();

    console.log('Existing user check result:', { existingUser, fetchError });

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing user:', fetchError);
      throw fetchError;
    }

    const userData = {
      id: kakaoUser.id,
      nickname: kakaoUser.profile_nickname || kakaoUser.properties?.nickname,
      profile_image: kakaoUser.profile_thumbnail_image || kakaoUser.properties?.thumbnail_image,
      last_login: new Date().toISOString()
    };

    console.log('Prepared user data:', userData);

    if (!existingUser) {
      console.log('Creating new user...');
      const { data, error } = await supabase
        .from('users')
        .insert([{ ...userData, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) {
        console.error('Error creating new user:', error);
        throw error;
      }
      console.log('New user created:', data);
      return data;
    } else {
      console.log('Updating existing user...');
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', kakaoUser.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }
      console.log('User updated:', data);
      return data;
    }
  } catch (error) {
    console.error('Detailed error in createOrUpdateUser:', error);
    throw error;
  }
}

export async function getUserData(userId: number) {
  // 먼저 사용자 기본 정보 가져오기
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) throw userError;

  // 사용자에 대한 MBTI 평가 결과 가져오기 (다른 사람이 평가한 결과)
  const { data: receivedResults, error: receivedError } = await supabase
    .from('mbti_results')
    .select(`
      id,
      mbti_result,
      created_at,
      tester:users!mbti_results_tester_id_fkey (
        id,
        nickname,
        profile_image
      )
    `)
    .eq('target_id', userId)
    .order('created_at', { ascending: false });

  if (receivedError) throw receivedError;

  // 사용자가 다른 사람을 평가한 결과 가져오기
  const { data: givenResults, error: givenError } = await supabase
    .from('mbti_results')
    .select(`
      id,
      mbti_result,
      created_at,
      target:users!mbti_results_target_id_fkey (
        id,
        nickname,
        profile_image
      )
    `)
    .eq('tester_id', userId)
    .order('created_at', { ascending: false });

  if (givenError) throw givenError;

  // 모든 데이터 합치기
  return {
    ...userData,
    received_results: receivedResults,
    given_results: givenResults
  };
}

export async function saveTestResult(
  testerId: number,
  targetId: number,
  mbtiResult: string
) {
  console.log('Attempting to save test result:', {
    testerId,
    targetId,
    mbtiResult
  });

  try {
    // 먼저 insert 시도
    const { data, error } = await supabase
      .from('mbti_results')
      .insert({
        tester_id: testerId,
        target_id: targetId,
        mbti_result: mbtiResult,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        tester:users!mbti_results_tester_id_fkey (
          id,
          nickname,
          profile_image
        )
      `)
      .single();

    if (error) {
      console.error('Error saving test result:', error);
      throw error;
    }

    console.log('Test result saved successfully:', data);
    return data;
  } catch (error) {
    console.error('Detailed error in saveTestResult:', error);
    throw error;
  }
}

export async function getTestResultsForUser(userId: number) {
  console.log('Fetching test results for user:', userId);
  
  const { data, error } = await supabase
    .from('mbti_results')
    .select(`
      *,
      tester:users!mbti_results_tester_id_fkey (
        id,
        nickname,
        profile_image
      )
    `)
    .eq('target_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching test results:', error);
    throw error;
  }

  console.log('Test results fetched:', data);
  return data;
} 