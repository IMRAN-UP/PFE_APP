import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 