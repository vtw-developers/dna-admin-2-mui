// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  MANAGE: '/manage',
  API_INFO: '/manage/api',
  CTI_INFO: '/manage/cti',
  SERVICE_GROUP: '/manage/service-group',
  SCHEDULE: '/manage/schedule',
  API_LOG: '/monitor/log/api',
  API_STATS: '/monitor/stats/api',
  CTI_LOG: '/monitor/log/cti',
  CTI_STATS: '/monitor/stats/cti',
  BOARDS: '/boards',
  BOARD: '/manage/board',
  PAGE_INFO: '/manage/page-info',
  MENU: '/manage/menu',
  USER: '/manage/user',
  FLOW_TEMPLATE: '/flow/template',
  FLOW: '/flow/flow',
  DATASOURCE: '/manage/datasource',
};

// ----------------------------------------------------------------------

export const paths = {
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
  flow: {
    template: {
      root: `${ROOTS.FLOW_TEMPLATE}`,
      new: `${ROOTS.FLOW_TEMPLATE}/new`,
      details: (id: string | number | undefined) => `${ROOTS.FLOW_TEMPLATE}/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.FLOW_TEMPLATE}/${id}/edit`,
    },
    flow: {
      root: `${ROOTS.FLOW}`,
      new: `${ROOTS.FLOW}/new`,
      details: (id: string | number | undefined) => `${ROOTS.FLOW}/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.FLOW}/${id}/edit`,
    },
  },
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
    datasource: {
      root: `${ROOTS.DATASOURCE}`,
      new: `${ROOTS.DATASOURCE}/new`,
      details: (id: string | number | undefined) => `${ROOTS.DATASOURCE}/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.DATASOURCE}/${id}/edit`,
    },
    schedule: {
      root: `${ROOTS.SCHEDULE}`,
      new: `${ROOTS.SCHEDULE}/new`,
      details: (id: string | number | undefined) => `${ROOTS.SCHEDULE}/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.SCHEDULE}/${id}/edit`,
    },
    board: {
      root: `${ROOTS.BOARD}`,
      new: `${ROOTS.BOARD}/new`,
      details: (id: string | number | undefined) => `${ROOTS.BOARD}/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.BOARD}/${id}/edit`,
    },
    pageInfo: {
      root: `${ROOTS.PAGE_INFO}`,
      new: `${ROOTS.PAGE_INFO}/new`,
      details: (id: string | number | undefined) => `${ROOTS.PAGE_INFO}/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.PAGE_INFO}/${id}/edit`,
    },
    menu: {
      root: `${ROOTS.MENU}`,
    },
    user: {
      root: `${ROOTS.USER}`,
      new: `${ROOTS.USER}/new`,
      details: (id: string | undefined) => `${ROOTS.USER}/${id}`,
      edit: (id: string | undefined) => `${ROOTS.USER}/${id}/edit`,
    },
  },
  boards: {
    free: {
      root: `${ROOTS.BOARDS}/free`,
      new: `${ROOTS.BOARDS}/free/new`,
      details: (id: string | number | undefined) => `${ROOTS.BOARDS}/free/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.BOARDS}/free/${id}/edit`,
    },
    notice: {
      root: `${ROOTS.BOARDS}/notice`,
      new: `${ROOTS.BOARDS}/notice/new`,
      details: (id: string | number | undefined) => `${ROOTS.BOARDS}/notice/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.BOARDS}/notice/${id}/edit`,
    },
    qna: {
      root: `${ROOTS.BOARDS}/qna`,
      new: `${ROOTS.BOARDS}/qna/new`,
      details: (id: string | number | undefined) => `${ROOTS.BOARDS}/qna/${id}`,
      edit: (id: string | number | undefined) => `${ROOTS.BOARDS}/qna/${id}/edit`,
      reply: (id: string | number | undefined) => `${ROOTS.BOARDS}/qna/${id}/reply`,
    },
  },
  monitor: {
    log: {
      api: `${ROOTS.API_LOG}`,
      cti: `${ROOTS.CTI_LOG}`,
    },
    stats: {
      api: `${ROOTS.API_STATS}`,
      cti: `${ROOTS.CTI_STATS}`,
    },
  },
};
