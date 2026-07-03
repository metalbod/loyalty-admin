import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Same unauthenticated-redirect behavior as ProtectedRoute, plus a role check: a logged-in
 * but non-superadmin user is bounced to '/' rather than to /login (they ARE authenticated,
 * they just can't see institution management).
 */
export function SuperAdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.role !== 'ROLE_SUPERADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}

SuperAdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SuperAdminRoute;
