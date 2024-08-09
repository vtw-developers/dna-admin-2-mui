'use client';

import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { useAuthContext } from '../../auth/hooks';
import { jwtDecode, setSession, STORAGE_KEY, refreshToken } from '../../auth/context/jwt';

// ----------------------------------------------------------------------
export type AccountTimerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountTimer({ data = [], sx, ...other }: AccountTimerProps) {
  const { user } = useAuthContext();
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!user) return;
    resetRemainingTime();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const id = setInterval(() => {
      setRemainingTime((ms) => ms - 1000);
    }, 1000);

    if (remainingTime < 0) {
      clearInterval(id);
      return;
    }

    return () => clearInterval(id);
  }, [user, remainingTime]);

  if (!user) {
    return <></>;
  }

  function decorateRemainingTime(millis: number) {
    if (millis <= 0) {
      return '00:00';
    }
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${(+minutes < 10 ? '0' : '') + minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
  }

  const onRefreshTokenClick = () => {
    refreshToken().then((data) => {
      const { token } = data;

      if (!token) {
        throw new Error('Access token not found in response');
      }

      setSession(token);
      resetRemainingTime();
    });
  };

  const resetRemainingTime = () => {
    const token = sessionStorage.getItem(STORAGE_KEY);
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentDate = new Date();
      const loginExpireMs = decodedToken.exp * 1000 - currentDate.getTime();
      setRemainingTime(loginExpireMs);
    }
  };

  return (
    <>
      <Box>{decorateRemainingTime(remainingTime)}</Box>
      <Button variant="text" color="inherit" onClick={onRefreshTokenClick}>
        연장
      </Button>
    </>
  );
}
