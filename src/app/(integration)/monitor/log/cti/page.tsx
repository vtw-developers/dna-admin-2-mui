import { CONFIG } from 'src/config-global';

import { CtiLogListView } from '../../../../../sections/cti-log/view/cti-log-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `CTI | ${CONFIG.site.name}` };

export default function Page() {
  return <CtiLogListView />;
}
