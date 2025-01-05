/**
 * OAuthHandler Component
 * Handles the OAuth callback from Kakao login
 * Processes the authorization code and redirects back to the main app
 */

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Props for the OAuthHandler component
interface OAuthHandlerProps {
    onLoginSuccess: () => void;  // Callback function to execute after successful login
}

// OAuthHandler component that processes the OAuth callback
function OAuthHandler({ onLoginSuccess }: OAuthHandlerProps) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Extract authorization code from URL query parameters
        const query = new URLSearchParams(location.search);
        const code = query.get('code');

        // Process authorization code if present
        if (code) {
            // Notify parent component of successful login
            onLoginSuccess();
            // Redirect to home page and replace current history entry
            navigate('/', { replace: true });
        } else {
            // Redirect to home if no authorization code is present
            navigate('/');
        }
    }, [location, navigate, onLoginSuccess]);

    // Display loading message while processing
    return <div>카카오톡 로그인 처리 중...</div>;
}

export default OAuthHandler; 