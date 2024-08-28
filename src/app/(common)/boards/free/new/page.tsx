import { CONFIG } from 'src/config-global';

import { FreeEditView } from '../../../../../sections/free/view/free-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `자유게시판 - ${CONFIG.site.name}` };

export default async function Page() {
  return <FreeEditView editMode="create" />;
}
