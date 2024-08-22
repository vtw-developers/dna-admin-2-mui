export type UserType = Record<string, any> | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
};

export type AuthContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};

export type RoleState = {
  userRoleLevel: number;
  readRoleLevel: number;
  writeRoleLevel: number;
  loading: boolean;
};

export type RoleContextValue = {
  readRole: boolean;
  writeRole: boolean;
  setCurrentPath: (path: string) => void;
};
