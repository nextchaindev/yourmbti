import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OAuthHandler() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const code = query.get('code');

        if (code) {
            // 코드를 URL 파라미터로 전달
            navigate(`/?code=${code}`, { replace: true });
        } else {
            navigate('/');
        }
    }, [location, navigate]);

    return <div>카카오톡 로그인 처리 중...</div>;
}

export default OAuthHandler; 