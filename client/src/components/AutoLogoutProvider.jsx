import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogoutProvider = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const { exp } = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = exp * 1000 - Date.now();

            if (expirationTime <= 0) {
                localStorage.removeItem('token');
                navigate('/sign-in');
            } else {
                setTimeout(() => {
                    localStorage.removeItem('token');
                    navigate('/sign-in');
                }, expirationTime);
            }
        }
    }, [navigate]);

    return children;
};

export default AutoLogoutProvider;
