import { CONFIG } from 'src/config-global';

import { BoardMasterListView } from '../../../../sections/board-master/view/board-master-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page | ${CONFIG.site.name}` };

export default function Page() {
  return <BoardMasterListView />;
}
