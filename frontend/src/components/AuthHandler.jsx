import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export default function AuthHandler() {
    const navigate = useNavigate();
    const location = useLocation();
    const { checkAuthStatus } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const authStatus = params.get('auth');

        if (authStatus) {
            checkAuthStatus();
            params.delete('auth');
            const newUrl = location.pathname + (params.toString() ? '?' + params.toString() : '');
            window.history.replaceState({}, document.title, newUrl);

            if (authStatus === 'success') {
                navigate('/dashboard', { replace: true });
            } else if (authStatus === 'new') {
                navigate('/onboard', { replace: true });
            } else if (authStatus === 'error') {
                navigate('/sign-in', { replace: true });
            }
        }
    }, [location.search, location.pathname, checkAuthStatus, navigate]);

    return null;
}
