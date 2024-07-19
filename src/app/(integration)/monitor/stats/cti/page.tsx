import { CONFIG } from 'src/config-global';

import { CtiInfoListView } from '../../../../sections/cti-info/view/cti-info-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `CTI | ${CONFIG.site.name}` };

export default function Page() {
  return <CtiInfoListView />;
}
