import React, { useState, useEffect } from 'react';
import { QuestionCard } from './components/QuestionCard';
import { ProgressBar } from './components/ProgressBar';
import { TypeCard } from './components/TypeCard';
import { KakaoLogin } from './components/KakaoLogin';
import { questions } from './data/questions';
import { mbtiData } from './types/mbti';
import { Answer } from './types/question';
import { KakaoUser } from './types/kakao';
import { calculateMBTI } from './utils/mbtiCalculator';
import { Brain } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import OAuthHandler from './OAuthHandler';
import { Language, translations } from './types/language';
import { createOrUpdateUser, saveTestResult, getTestResultsForUser, getUserData } from './lib/userService';
import { supabase, signInWithKakao } from './lib/supabase';

const getRedirectUri = () => {
  return `${import.meta.env.VITE_APP_URL}/oauth`;
};

async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: 'YOUR_CLIENT_ID', // Replace with your Kakao client ID
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();
    if (data.access_token) {
      console.log('New access token:', data.access_token);
      // Store the new access token and update your application logic
      localStorage.setItem('kakaoAccessToken', data.access_token);
    } else {
      console.error('Failed to refresh access token:', data);
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
}

function AppContent() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [user, setUser] = useState<KakaoUser | null>(null);
  const [friends, setFriends] = useState<KakaoUser[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<KakaoUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('ko');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [session, setSession] = useState(null);
  const [myMbtiResult, setMyMbtiResult] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Initialize Kakao SDK
    if (window.Kakao && !window.Kakao.isInitialized()) {
      try {
        window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
        console.log('Kakao SDK initialized');
      } catch (error) {
        console.error('Failed to initialize Kakao SDK:', error);
      }
    }

    try {
      // 사용자 정보 불러오기
      const savedUser = localStorage.getItem('kakaoUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        
        // 저장된 친구 목록이 있다면 불러오기
        const savedFriends = localStorage.getItem('kakaoFriends');
        if (savedFriends) {
          setFriends(JSON.parse(savedFriends));
        } else {
          // 저장된 친구 목록이 없다면 새로 가져오기
          fetchFriends();
        }
      }
    } catch (error) {
      console.log('localStorage not available');
    }
  }, []);

  useEffect(() => {
    // URL에서 코드 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        handleAuthCode(code);
        // 코드 파라미터 제거하고 홈으로 이동
        window.history.replaceState({}, document.title, '/');
    }
  }, [location]);

  const handleAuthCode = async (code: string) => {
    try {
        if (window.Kakao?.Auth) {
            window.Kakao.Auth.login({
                redirectUri: getRedirectUri(),  // 동적으로 리다이렉트 URI 설정
                scope: 'friends',
                success: (authObj) => {
                    try {
                        window.Kakao.Auth.setAccessToken(authObj.access_token);
                        fetchUserInfo(); // 로그인 성공 시 사용자 정보 가져오기
                    } catch (error) {
                        console.error('Error in login process:', error);
                        setIsLoggingIn(false);
                    }
                },
                fail: (err) => {
                    console.error('Login failed:', err);
                    setIsLoggingIn(false);
                }
            });
        }
    } catch (error) {
        console.error('Error in auth code handling:', error);
        setIsLoggingIn(false);
    }
  };

  const fetchUserInfo = () => {
    if (!window.Kakao?.API) return;

    window.Kakao.API.request({
        url: '/v2/user/me',
        success: async (res) => {
            console.log('Kakao user info received:', res);
            setUser(res);
            try {
                if (res) {
                    console.log('Attempting to save user to Supabase...');
                    await createOrUpdateUser(res);
                    console.log('User saved to Supabase successfully');
                    
                    // 사용자 데이터 가져오기
                    const userData = await getUserData(res.id);
                    console.log('Retrieved user data from Supabase:', userData);
                    
                    // 받은 평가 결과 설정
                    if (userData?.received_results) {
                        setTestResults(userData.received_results);
                    }
                }
            } catch (error) {
                console.error('Failed to save/fetch user data:', error);
            }
            
            localStorage.setItem('kakaoUser', JSON.stringify(res));
        },
        fail: (error) => {
            console.error('Failed to fetch user info:', error);
            alert('사용자 정보를 가져오는데 실패했습니다.');
        }
    });
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      // 카카오 로그인
      await window.Kakao.Auth.login({
        scope: 'profile_nickname,profile_image',
        success: async (authObj) => {
          const kakaoUserInfo = await window.Kakao.API.request({
            url: '/v2/user/me'
          });
          
          // Supabase 인증
          const { user, error } = await signInWithKakao(kakaoUserInfo);
          if (error) throw error;
          
          setUser(user);
          fetchUserTestResults(user.id);
        },
        fail: (err) => {
          throw err;
        }
      });
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAnswer = (answer: Answer) => {
    console.log('Handling answer:', answer);
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === answer.questionId);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers.push(answer);
    }
    
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const mbtiType = calculateMBTI(newAnswers, questions);
      handleTestComplete(mbtiType);
    }
  };

  const getCurrentAnswer = (questionId: number): 0 | 1 | undefined => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.value;
  };

  const restart = () => {
    console.log('Starting new test...');
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(null);
    setIsTestMode(true);  // 테스트 모드 활성화
  };

  const fetchFriends = async () => {
    if (window.Kakao && window.Kakao.Auth) {
      try {
        console.log('Fetching friends list...');
        const response = await window.Kakao.API.request({
          url: '/v1/api/talk/friends',
        });
        console.log('Friends list response:', response);
        if (response.elements) {
          console.log('Friends list fetched:', response.elements);
          setFriends(response.elements);
          // 친구 목록을 localStorage에 저장
          localStorage.setItem('kakaoFriends', JSON.stringify(response.elements));
        } else {
          console.error('No friends data found in response:', response);
          alert('친구 목록을 불러올 수 없습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('Failed to fetch friends:', error);
        alert('친구 목록을 불러오는 중 오류가 발생했습니다. 권한을 확인하고 다시 시도해주세요.');
      }
    } else {
      console.error('Kakao SDK not initialized or Auth not available.');
      alert('Kakao SDK가 초기화되지 않았습니다. 설정을 확인해주세요.');
    }
  };

  const checkAndRefreshToken = async () => {
    const accessToken = localStorage.getItem('kakaoAccessToken');
    const refreshToken = localStorage.getItem('kakaoRefreshToken');

    if (!accessToken) {
      console.error('No access token found. Please log in again.');
      alert('로그인이 필요합니다. 다시 로그인 해주세요.');
      return;
    }

    try {
      console.log('Checking access token:', accessToken);
      const response = await fetch('https://kapi.kakao.com/v2/user/scopes', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) {
        console.log('Access token expired or invalid. Refreshing token...');
        if (refreshToken) {
          await refreshAccessToken(refreshToken);
        } else {
          console.error('No refresh token available. Please log in again.');
          alert('로그인이 필요합니다. 다시 로그인 해주세요.');
        }
      } else {
        console.log('Access token is valid.');
      }
    } catch (error) {
      console.error('Error checking access token:', error);
      alert('토큰 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    if (user) {
      // checkAndRefreshToken(); // 이 분 제거
    }
  }, [user]);

  const handleFriendSelect = (friend: KakaoUser) => {
    setSelectedFriend(friend);
  };

  const handleFriendAnswer = (answer: Answer) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === answer.questionId);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = answer;
    } else {
      newAnswers.push(answer);
    }
    
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const mbtiType = calculateMBTI(newAnswers, questions);
      handleTestComplete(mbtiType);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kakaoUser');
    localStorage.removeItem('kakaoAccessToken');
    localStorage.removeItem('kakaoFriends');  // 친구 목록도 삭제
    setUser(null);
    setFriends([]);
    setSelectedFriend(null);
  };

  // 권한 요청 함수 추가
  const requestFriendPermission = () => {
    if (!window.Kakao?.Auth) {
        alert('Kakao SDK가 초기화되지 않았습니다.');
        return;
    }

    window.Kakao.Auth.login({
        scope: 'talk_message,friends',  // 두 가지 권한 모두 요청
        success: (authObj) => {
            try {
                // 새로운 액세스 토큰으로 업데이트
                window.Kakao.Auth.setAccessToken(authObj.access_token);
                localStorage.setItem('kakaoAccessToken', authObj.access_token);
                // 권한 획득 후 친구 목록 다시 조회
                fetchFriends();
            } catch (error) {
                console.error('Error in friend permission process:', error);
            }
        },
        fail: (err) => {
            console.error('Failed to get friend permission:', err);
            alert('친구 목록 권한 획득에 실패했습니다.');
        }
    });
  };

  // 언어 전환 버튼 컴포넌트
  const LanguageToggle = () => (
    <button
      onClick={() => setLanguage(prev => prev === 'ko' ? 'en' : 'ko')}
      className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors ml-4"
    >
      {language === 'ko' ? 'EN' : '한국어'}
    </button>
  );

  const handleLoginSuccess = async () => {
    if (!user) return;
    
    try {
        console.log('Starting login process with user:', user);

        // Supabase에 사용자 정보 저장/업데이트
        const userData = await createOrUpdateUser(user);
        console.log('User data saved/updated:', userData);

        // 사용자의 전체 데이터 (테스트 결과 포함) 가져오기
        const fullUserData = await getUserData(user.id);
        console.log('Full user data:', fullUserData);

        // 테스트 결과가 있다면 상태 업데이트
        if (fullUserData.mbti_results) {
            setTestResults(fullUserData.mbti_results);
        }

        // localStorage에 사용자 정보 저장
        localStorage.setItem('kakaoUser', JSON.stringify(user));
    } catch (error) {
        console.error('Detailed error in login process:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
    }
  };

  // 사용자에 대한 테스트 결과 가져오기
  const fetchUserTestResults = async () => {
    if (!user) return;
    try {
      const results = await getTestResultsForUser(user.id);
      setTestResults(results);
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  // MBTI 결과 저장
  const handleTestComplete = async (mbtiType: string) => {
    if (!user) {
      console.error('No authenticated user found');
      return;
    }
    
    try {
      const targetId = selectedFriend ? selectedFriend.id : user.id;
      
      console.log('Saving test result:', {
        testerId: user.id,
        targetId: targetId,
        mbtiResult: mbtiType
      });

      const result = await saveTestResult(
        user.id,
        targetId,
        mbtiType
      );
      
      console.log('Test result saved:', result);
      
      // 상태 업데이트 순서 변경
      if (targetId === user.id) {
        setMyMbtiResult(mbtiType);  // 먼저 myMbtiResult 업데이트
      }
      setResult(mbtiType);
      setIsTestMode(false);

      // 전체 결과 새로고침
      try {
        const userData = await getUserData(user.id);
        console.log('Updated user data:', userData);
        
        if (userData?.received_results) {
          // 자신의 결과만 필터링
          const selfResults = userData.received_results.filter(
            (result: any) => result.tester_id === user.id && result.target_id === user.id
          );
          
          if (selfResults.length > 0) {
            const latestResult = selfResults[0];
            setMyMbtiResult(latestResult.mbti_result);
            console.log('Updated myMbtiResult:', latestResult.mbti_result);
          }
          
          setTestResults(userData.received_results);
        }
      } catch (error) {
        console.error('Error fetching updated results:', error);
      }

    } catch (error) {
      console.error('Error saving test result:', error);
      alert('테스트 결과 저장에 실패했습니다.');
    }
  };

  useEffect(() => {
    // 세션 상태 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserTestResults(session.user.id);
      }
    });

    // 세션 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 사용자의 가장 최근 MBTI 결과를 가져오는 함수
  const fetchMyLatestResult = async (userId: number) => {
    try {
      const userData = await getUserData(userId);
      console.log('Fetched user data:', userData);
      
      if (userData?.received_results && userData.received_results.length > 0) {
        // 자신이 자신을 평가한 결과만 필터링
        const selfResults = userData.received_results.filter(
          result => result.tester.id === userId
        );
        
        if (selfResults.length > 0) {
          // 가장 최근 결과 사용
          const latestResult = selfResults[0];
          console.log('Latest self MBTI result:', latestResult);
          setMyMbtiResult(latestResult.mbti_result);
        }
      }
    } catch (error) {
      console.error('Error fetching my MBTI result:', error);
    }
  };

  // 로그인 성공 시 자신의 MBTI 결과 가져오기
  useEffect(() => {
    if (user) {
      fetchMyLatestResult(user.id);
    }
  }, [user]);

  // 테스트 관련 공통 컴포넌트
  const TestScreen = () => (
    <div className="max-w-2xl mx-auto">
      <ProgressBar
        current={currentQuestionIndex + 1}
        total={questions.length}
      />
      <QuestionCard
        question={questions[currentQuestionIndex]}
        onAnswer={handleAnswer}
        currentAnswer={getCurrentAnswer(questions[currentQuestionIndex].id)}
      />
    </div>
  );

  // 결과 화면 공통 컴포넌트
  const ResultScreen = ({ mbtiType, userName }: { mbtiType: string, userName: string }) => (
    <div>
      <TypeCard 
        data={mbtiData[mbtiType]} 
        userName={userName}
        language={language}
      />
      <button
        onClick={restart}
        className="mt-6 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {translations[language].retakeTest}
      </button>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {translations[language].title}
            </h1>
            <p className="text-gray-600">
              {translations[language].loginMessage}
            </p>
          </div>
          <KakaoLogin onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/oauth" element={<OAuthHandler onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/" element={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <header className="flex justify-between items-center py-4">
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => {
                  setSelectedFriend(null);
                  setResult(null);
                  setAnswers([]);
                  setCurrentQuestionIndex(0);
                }}
              >
                <Brain className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 ml-2">
                  {translations[language].title}
                </h1>
              </div>
              <div className="flex items-center">
                <LanguageToggle />
                {user && (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors ml-4"
                  >
                    {translations[language].logout}
                  </button>
                )}
              </div>
            </header>

            {isTestMode ? (
              <TestScreen />
            ) : (
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">
                    {translations[language].myMbtiTitle}
                  </h2>
                  {myMbtiResult ? (
                    <ResultScreen 
                      mbtiType={myMbtiResult} 
                      userName={user.profile_nickname || ''} 
                    />
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-4">
                        {translations[language].myMbtiDesc}
                      </p>
                      <button
                        onClick={restart}
                        className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {translations[language].startTest}
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">
                    {translations[language].friendMbtiTitle}
                  </h2>
                  {friends.length > 0 ? (
                    <ul>
                      {friends.map(friend => (
                        <li 
                          key={friend.id} 
                          onClick={() => handleFriendSelect(friend)}
                          className="p-4 bg-white rounded-lg shadow-sm mb-2 hover:bg-gray-50 cursor-pointer flex items-center"
                        >
                          {friend.profile_thumbnail_image && (
                            <img 
                              src={friend.profile_thumbnail_image} 
                              alt={friend.profile_nickname} 
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          )}
                          <span className="text-gray-800">{friend.profile_nickname}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        {translations[language].emptyFriendList}
                      </p>
                      <button
                        onClick={requestFriendPermission}
                        className="bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                      >
                        {translations[language].requestPermission}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}