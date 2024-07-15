// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  MANAGE: '/manage',
  API_INFO: '/manage/api',
  CTI_INFO: '/manage/cti',
  SERVICE_GROUP: '/manage/service-group',
};

// ----------------------------------------------------------------------

export const paths = {
  manage: {
    api: {
      root: `${ROOTS.API_INFO}`,
      new: `${ROOTS.API_INFO}/new`,
      details: (id: string | number | undefined) => `${ROOTS.API_INFO}/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.API_INFO}/${id}/edit`,
    },
    cti: {
      root: `${ROOTS.CTI_INFO}`,
      new: `${ROOTS.CTI_INFO}/new`,
      details: (id: string | number | undefined) => `${ROOTS.CTI_INFO}/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.CTI_INFO}/${id}/edit`,
    },
    serviceGroup: {
      root: `${ROOTS.SERVICE_GROUP}`,
      new: `${ROOTS.SERVICE_GROUP}/new`,
      details: (id: string | number | undefined) => `${ROOTS.SERVICE_GROUP}/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.SERVICE_GROUP}/${id}/edit`,
    },
  },

  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
};
