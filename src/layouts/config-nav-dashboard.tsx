import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData = [
  // /**
  //  * Overview
  //  */
  // {
  //   subheader: 'Overview 6.0.0',
  //   items: [
  //     { title: 'One', path: paths.dashboard.root, icon: ICONS.dashboard },
  //     { title: 'Two', path: paths.dashboard.two, icon: ICONS.ecommerce },
  //     { title: 'Three', path: paths.dashboard.three, icon: ICONS.analytics },
  //   ],
  // },
  // /**
  //  * Management
  //  */
  // {
  //   subheader: 'Management',
  //   items: [
  //     {
  //       title: 'Group',
  //       path: paths.dashboard.group.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'Four', path: paths.dashboard.group.root },
  //         { title: 'Five', path: paths.dashboard.group.five },
  //         { title: 'Six', path: paths.dashboard.group.six },
  //       ],
  //     },
  //   ],
  // },

  {
    subheader: '연계관리',
    items: [
      { title: 'API 관리', path: paths.manage.api.root, icon: ICONS.dashboard },
      { title: 'CTI 관리', path: paths.manage.cti.root, icon: ICONS.ecommerce },
      { title: '서비스그룹 관리', path: paths.manage.serviceGroup.root, icon: ICONS.analytics },
    ],
  },
  {
    subheader: '연계현황',
    items: [
      { title: '대시보드', path: paths.dashboard.two, icon: ICONS.ecommerce },
      { title: '스케줄', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'API 로그', path: paths.dashboard.three, icon: ICONS.analytics },
      { title: 'CTI 로그', path: paths.dashboard.three, icon: ICONS.analytics },
      { title: 'API 통계', path: paths.dashboard.three, icon: ICONS.analytics },
      { title: 'CTI 통계', path: paths.dashboard.three, icon: ICONS.analytics },
    ],
  },
  {
    subheader: '게시판',
    items: [
      { title: '공지사항', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: '자유게시판', path: paths.dashboard.two, icon: ICONS.ecommerce },
      { title: 'Q&A', path: paths.dashboard.three, icon: ICONS.analytics },
    ],
  },
  {
    subheader: '관리자',
    items: [
      { title: '메뉴 관리', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: '페이지 관리', path: paths.dashboard.two, icon: ICONS.ecommerce },
      { title: '게시판 관리', path: paths.dashboard.three, icon: ICONS.analytics },
    ],
  },
];
