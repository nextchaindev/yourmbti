/**
 * Language Type Definitions and Translations
 * Contains type definitions and translations for multilingual support
 */

// Supported languages in the application
export type Language = 'ko' | 'en';

// Translation data for all supported languages
export const translations = {
  ko: {
    title: 'MBTI 성격유형 테스트',
    loginMessage: '카카오톡으로 로그인하고 나만의 MBTI를 알아보세요',
    logout: '로그아웃',
    testTitle: '의 MBTI 테스트',
    selectFriend: '친구를 선택하고 그 친구에 대해 평가하세요',
    evaluationOf: '에 대한 평가',
    retakeTest: '다시 테스트하기',
    myMbtiTitle: '의 MBTI 알아보기',
    myMbtiDesc: '자신의 MBTI를 테스트해보세요!',
    startTest: 'MBTI 테스트하기',
    friendMbtiTitle: '친구의 MBTI 알아보기',
    emptyFriendList: '친구 목록이 비어 있습니다.',
    requestPermission: '친구 목록 권한 요청하기',
    loading: '처리 중...'
  },
  en: {
    title: 'MBTI Personality Test',
    loginMessage: 'Login with KakaoTalk and discover your MBTI',
    logout: 'Logout',
    testTitle: "'s MBTI Test",
    selectFriend: 'Select a friend and evaluate their personality',
    evaluationOf: "'s Evaluation",
    retakeTest: 'Take Test Again',
    myMbtiTitle: "'s MBTI Test",
    myMbtiDesc: 'Take your own MBTI test!',
    startTest: 'Start MBTI Test',
    friendMbtiTitle: "Find Friend's MBTI",
    emptyFriendList: 'Friend list is empty.',
    requestPermission: 'Request Friend List Permission',
    loading: 'Processing...'
  }
}; 