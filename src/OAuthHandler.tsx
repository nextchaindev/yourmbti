import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface OAuthHandlerProps {
    onLoginSuccess: () => void;
}

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