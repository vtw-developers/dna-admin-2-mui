import { CONFIG } from 'src/config-global';

import { BoardMasterEditView } from '../../../../../sections/board-master/view/board-master-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `게시판 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <BoardMasterEditView editMode="create" />;
}
