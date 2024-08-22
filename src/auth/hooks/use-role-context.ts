'use client';

import { useContext } from 'react';

import { RoleContext } from '../context/role-context';

// ----------------------------------------------------------------------

export function useRoleContext() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error('useAuthContext: Context must be used inside AuthProvider');
  }

  return context;
}
