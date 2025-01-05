import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * OAuthHandler Component
 * Handles the OAuth callback from Kakao login
 * Processes the authorization code and redirects back to the main app
 */

// Props for the OAuthHandler component
interface OAuthHandlerProps {
    onLoginSuccess: () => void;  // Callback function to execute after successful login
}

// OAuthHandler component that processes the OAuth callback
function OAuthHandler({ onLoginSuccess }: OAuthHandlerProps) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const code = query.get('code');

        if (code) {
            onLoginSuccess();
            navigate('/', { replace: true });
        } else {
            navigate('/');
        }
    }, [location, navigate, onLoginSuccess]);

    return <div>카카오톡 로그인 처리 중...</div>;
}

export default OAuthHandler; 