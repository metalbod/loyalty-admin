import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Wraps any view that requires a logged-in user. Redirects to /login, remembering the
 * page that was requested (via router state) so LoginView can send the user back there
 * after a successful login instead of always landing on the dashboard root.
 *
 * This also transparently handles the "token expired mid-session" case: AuthContext's 401
 * interceptor callback clears `user`, which flips isAuthenticated to false and re-renders
 * this component on its next pass, redirecting to /login with no extra wiring needed here.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
