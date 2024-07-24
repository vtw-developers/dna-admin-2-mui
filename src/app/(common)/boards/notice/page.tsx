import { CONFIG } from 'src/config-global';

import { NoticeListView } from '../../../../sections/notice/view/notice-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Notice | ${CONFIG.site.name}` };

export default function Page() {
  return <NoticeListView />;
}
