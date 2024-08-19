'use client';

import { useState, useEffect, useCallback } from 'react';

import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState<boolean>(true);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    console.log(`pathname: ${pathname}`);
    console.log(`로그인 여부: ${authenticated}`);

    if (!authenticated) {
      // TODO: 해당 페이지가 익명사용자가 접근 불가능한 페이지면 로그인 페이지로 이동
      // const { method } = CONFIG.auth;
      //
      // const signInPath = {
      //   jwt: paths.auth.jwt.signIn,
      // }[method];
      //
      // const href = `${signInPath}?${createQueryString('returnTo', pathname)}`;
      //
      // router.replace(href);
      // return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
