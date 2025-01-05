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

/**
 * Main App Component
 * Handles the core functionality of the MBTI test application including:
 * - Kakao OAuth authentication and user management
 * - MBTI test flow and result calculation
 * - Friend list management and friend MBTI evaluation
 * - Multilingual support (Korean/English)
 */

const getRedirectUri = () => {
  const currentUrl = window.location.origin;  // http://localhost:5173 또는 https://yourmbti.vercel.app
  return `${currentUrl}/oauth`;
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

  // Initialize Kakao SDK and load user data on component mount
  useEffect(() => {
    // Initialize Kakao SDK
    if (window.Kakao && !window.Kakao.isInitialized()) {
      try {
        //window.Kakao.init('f6b0fbb146c2235c751ab8415b2d1a28');  //a1ad1e811e4007cfe79c5ef89582eb0d
        window.Kakao.init('a1ad1e811e4007cfe79c5ef89582eb0d');  //테스트
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

  // Handle OAuth callback code from URL
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

  // Process the OAuth authorization code after Kakao login redirect
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

  // Fetch current user's information from Kakao API
  const fetchUserInfo = () => {
    if (!window.Kakao?.API) return;

    window.Kakao.API.request({
        url: '/v2/user/me',
        success: (res) => {
            console.log('User info:', res);
            setUser(res);
            localStorage.setItem('kakaoUser', JSON.stringify(res));
        },
        fail: (error) => {
            console.error('Failed to fetch user info:', error);
            alert('사용자 정보를 가져오는데 실패했습니다.');
        }
    });
  };

  // Initiate the Kakao login process with required permissions
  const handleLogin = () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    if (!window.Kakao?.Auth) {
        setIsLoggingIn(false);
        alert('Kakao SDK가 초기화되지 않았습니다.');
        return;
    }

    window.Kakao.Auth.login({
        scope: 'profile_nickname,profile_image,friends',  // 필요한 권한들을 정확한 이름으로 지정
        success: (authObj) => {
            try {
                window.Kakao.Auth.setAccessToken(authObj.access_token);
                fetchUserInfo();
            } catch (error) {
                console.error('Error in login process:', error);
                setIsLoggingIn(false);
            }
        },
        fail: (err) => {
            console.error('Login failed:', err);
            alert('로그인에 실패했습니다. 권한을 확인해주세요.');
            setIsLoggingIn(false);
        }
    });
  };

  // Record user's answer and update test progress
  const handleAnswer = (answer: Answer) => {
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
      setResult(mbtiType);
    }
  };

  // Get user's previous answer for a specific question
  const getCurrentAnswer = (questionId: number): 0 | 1 | undefined => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.value;
  };

  // Reset the test state to start over
  const restart = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setResult(null);
    setSelectedFriend(null);
  };

  // Fetch user's Kakao friends list
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

  // Check access token validity and refresh if needed
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

  // Handle friend selection for evaluation
  const handleFriendSelect = (friend: KakaoUser) => {
    setSelectedFriend(friend);
  };

  // Process friend's MBTI test answers
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
      setResult(mbtiType);
    }
  };

  // Handle user logout and clear stored data
  const handleLogout = () => {
    localStorage.removeItem('kakaoUser');
    localStorage.removeItem('kakaoAccessToken');
    localStorage.removeItem('kakaoFriends');  // 친구 목록도 삭제
    setUser(null);
    setFriends([]);
    setSelectedFriend(null);
  };

  // Request additional permissions for friend list access
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

  // Language toggle component for switching between Korean and English
  const LanguageToggle = () => (
    <button
      onClick={() => setLanguage(prev => prev === 'ko' ? 'en' : 'ko')}
      className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors ml-4"
    >
      {language === 'ko' ? 'EN' : '한국어'}
    </button>
  );

  // Handle successful login callback
  const handleLoginSuccess = () => {
    fetchUserInfo(); // 로그인 성공 시 사용자 정보 가져오기
  };

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
            <div className="text-center mb-10">
              <div className="flex justify-center mb-4">
                <Brain className="w-12 h-12 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {user.profile_nickname || user.properties?.nickname}{translations[language].testTitle}
              </h1>
              <p className="text-gray-600">
                {translations[language].selectFriend}
              </p>
            </div>

            {selectedFriend ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedFriend.profile_nickname || selectedFriend.properties?.nickname}{translations[language].evaluationOf}
                </h2>
                {!result ? (
                  <>
                    <ProgressBar
                      current={currentQuestionIndex + 1}
                      total={questions.length}
                    />
                    <QuestionCard
                      question={questions[currentQuestionIndex]}
                      onAnswer={handleFriendAnswer}
                      currentAnswer={getCurrentAnswer(questions[currentQuestionIndex].id)}
                    />
                  </>
                ) : (
                  <div>
                    <TypeCard 
                      data={mbtiData[result]} 
                      userName={selectedFriend.profile_nickname || selectedFriend.properties?.nickname} 
                    />
                    <button
                      onClick={restart}
                      className="mt-6 w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {translations[language].retakeTest}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    {(user.profile_thumbnail_image || user.properties?.thumbnail_image) && (
                        <img 
                            src={user.profile_thumbnail_image || user.properties?.thumbnail_image} 
                            alt={user.profile_nickname || user.properties?.nickname} 
                            className="w-12 h-12 rounded-full mr-4"
                        />
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {user.profile_nickname || user.properties?.nickname}{translations[language].myMbtiTitle}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {translations[language].myMbtiDesc}
                        </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFriendSelect(user)}
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {translations[language].startTest}
                  </button>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
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