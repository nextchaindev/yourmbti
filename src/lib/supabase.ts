import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl); // 환경변수 확인 (실제 배포 시 제거)
console.log('Connecting to Supabase...'); // 연결 시도 로그

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Kakao 로그인 함수
export async function signInWithKakao(kakaoUser: any) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        queryParams: {
          access_token: window.Kakao.Auth.getAccessToken()
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in with Kakao:', error);
    throw error;
  }
}

// 연결 테스트
supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
        console.error('Supabase connection error:', error);
    } else {
        console.log('Supabase connected successfully');
    }
}); 