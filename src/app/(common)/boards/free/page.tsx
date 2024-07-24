import { CONFIG } from 'src/config-global';

import { FreeListView } from '../../../../sections/free/view/free-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `FreeBoard | ${CONFIG.site.name}` };

export default function Page() {
  return <FreeListView />;
}
