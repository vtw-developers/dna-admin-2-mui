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
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
};
