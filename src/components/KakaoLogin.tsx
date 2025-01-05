/**
 * KakaoLogin Component
 * Handles the Kakao OAuth login process and displays the login button
 * Uses the Kakao SDK to authenticate users and retrieve their information
 */

import React from 'react';
import { MessageSquare } from 'lucide-react';

// Props for the KakaoLogin component
interface KakaoLoginProps {
  onLogin: () => void;
}

// Global type declaration for Kakao SDK
declare global {
  interface Window {
    Kakao: any;
  }
}

// KakaoLogin component that displays a Kakao-styled login button
export const KakaoLogin: React.FC<KakaoLoginProps> = ({ onLogin }) => {
  // Handle Kakao login process
  const handleLogin = () => {
    // Verify Kakao SDK is loaded before proceeding
    if (!window.Kakao) {
      console.error('Kakao SDK not loaded');
      return;
    }

    // Initiate Kakao login flow
    window.Kakao.Auth.login({
      success: () => {
        // After successful login, fetch user information
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res: any) => {
            // Create user object with necessary information
            const user = {
              id: res.id,
              properties: res.properties
            };
            // Store user data in localStorage for persistence
            localStorage.setItem('kakaoUser', JSON.stringify(user));
            // Notify parent component of successful login
            onLogin();
          },
          fail: (error: any) => {
            console.error('Failed to get user info', error);
          }
        });
      },
      fail: (error: any) => {
        console.error('Failed to login', error);
      }
    });
  };

  // Render Kakao-styled login button
  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center gap-2 w-full bg-[#FEE500] text-[#000000] py-3 px-4 rounded-lg hover:bg-[#FDD835] transition-colors"
    >
      <MessageSquare className="w-5 h-5" />
      카카오톡으로 시작하기
    </button>
  );
};