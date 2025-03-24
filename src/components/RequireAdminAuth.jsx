import { Navigate } from 'react-router-dom';
import { getToken } from '../services/adminAuthService';

const RequireAdminAuth = ({ children }) => {
  const token = getToken();

  return token ? children : <Navigate to="/admin-login" replace />;
};

export default RequireAdminAuth;
