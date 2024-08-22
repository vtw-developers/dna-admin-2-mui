'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { useAuthContext } from '../../hooks';
import { RoleContext } from '../role-context';
import { getUser } from '../../../actions/user';
import { pageRoleLevel } from '../../../actions/page-info';

import type { RoleState } from '../../types';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function RoleProvider({ children }: Props) {
  const { state, setState } = useSetState<RoleState>({
    userRoleLevel: 0,
    readRoleLevel: 0,
    writeRoleLevel: 0,
    loading: true,
  });

  const [currentPath, setCurrentPath] = useState<string>('/dashboard');

  useEffect(() => {
    console.log(currentPath);
  }, [currentPath]);

  const { user } = useAuthContext();

  const checkUserRole = useCallback(async () => {
    try {
      const page = await pageRoleLevel(currentPath);
      console.log(page);

      if (user != null) {
        const entity = await getUser(user.id);
        const userLevel = entity.roleLevel;

        setState({
          userRoleLevel: userLevel,
          readRoleLevel: page.readLevel,
          writeRoleLevel: page.writeLevel,
          loading: false,
        });
      } else {
        setState({
          userRoleLevel: 3,
          readRoleLevel: page.readLevel,
          writeRoleLevel: page.writeLevel,
          loading: false,
        });
      }
    } catch (error) {
      console.error(error);
      setState({ userRoleLevel: 0, loading: false });
    }
  }, [currentPath, setState, user]);

  useEffect(() => {
    checkUserRole();
  }, [checkUserRole]);

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      readRole: state.userRoleLevel <= state.readRoleLevel,
      writeRole: state.userRoleLevel <= state.writeRoleLevel,
      setCurrentPath,
    }),
    [setCurrentPath, state]
  );

  return <RoleContext.Provider value={memoizedValue}>{children}</RoleContext.Provider>;
}
