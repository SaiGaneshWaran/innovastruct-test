import { Navigate } from 'react-router-dom';
import userService from '../services/userService';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = userService.getCurrentUser();

  // If no user is logged in, redirect to the appropriate login page based on the route
  if (!user) {
    return <Navigate to={`/${allowedRole.toLowerCase()}/login`} replace />;
  }

  // If user's role doesn't match the allowed role, redirect to the appropriate login page
  if (user.role !== allowedRole) {
    // If a client tries to access company routes, send them to company login
    if (allowedRole === "COMPANY") {
      return <Navigate to="/company/login" replace />;
    }
    // If a company tries to access client routes, send them to client login
    if (allowedRole === "CLIENT") {
      return <Navigate to="/client/login" replace />;
    }
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;