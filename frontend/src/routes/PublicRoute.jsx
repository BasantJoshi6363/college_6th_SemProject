import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Only navigate if loading is finished and user is authenticated
        if (!loading && isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    // Show nothing (or a spinner) while checking auth status
    if (loading) {
        return <LoadingSpinner/>;
    }


    return !isAuthenticated ? children : null;
};

export default PublicRoute;