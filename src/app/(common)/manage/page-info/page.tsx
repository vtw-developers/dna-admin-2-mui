import { CONFIG } from 'src/config-global';

import { PageInfoListView } from '../../../../sections/page-info/view/page-info-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `페이지 | ${CONFIG.site.name}` };

export default function Page() {
  return <PageInfoListView />;
}
