import { CONFIG } from 'src/config-global';

import { NoticeEditView } from '../../../../../sections/notice/view/notice-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Notice - ${CONFIG.site.name}` };

export default async function Page() {
  return <NoticeEditView editMode="create" />;
}
