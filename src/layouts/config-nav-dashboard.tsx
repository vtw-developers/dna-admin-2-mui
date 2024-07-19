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
  {
    subheader: '연계관리',
    items: [
      { title: 'API 관리', path: paths.manage.api.root, icon: ICONS.blog },
      { title: 'CTI 관리', path: paths.manage.cti.root, icon: ICONS.blog },
      { title: '서비스그룹 관리', path: paths.manage.serviceGroup.root, icon: ICONS.blog },
      { title: '스케줄 관리', path: paths.manage.schedule.root, icon: ICONS.calendar },
    ],
  },
  {
    subheader: '연계현황',
    items: [
      { title: '대시보드', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'API 로그', path: paths.monitor.log.api, icon: ICONS.file },
      { title: 'API 통계', path: paths.monitor.stats.api, icon: ICONS.analytics },
      { title: 'CTI 로그', path: paths.monitor.log.cti, icon: ICONS.file },
      { title: 'CTI 통계', path: paths.monitor.stats.cti, icon: ICONS.analytics },
    ],
  },
  {
    subheader: '게시판',
    items: [
      { title: '공지사항', path: paths.boards.notice.root, icon: ICONS.calendar },
      { title: '자유게시판', path: paths.boards.free.root, icon: ICONS.chat },
      { title: 'Q&A', path: paths.boards.qna.root, icon: ICONS.banking },
    ],
  },
  {
    subheader: '관리자',
    items: [
      { title: '메뉴 관리', path: paths.manage.menu.root, icon: ICONS.menuItem },
      { title: '페이지 관리', path: paths.manage.pageInfo.root, icon: ICONS.job },
      { title: '게시판 관리', path: paths.manage.board.root, icon: ICONS.mail },
    ],
  },
];
