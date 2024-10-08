export type UserType = Record<string, any> | null;

export type MappingState = {
  user: UserType;
  loading: boolean;
};

export type MappingContextValue = {
  user: UserType;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
