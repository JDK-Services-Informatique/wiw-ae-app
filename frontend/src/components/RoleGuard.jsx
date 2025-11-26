import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleGuard({ user, allowedRoles, children }) {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
