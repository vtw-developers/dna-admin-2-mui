import { CONFIG } from 'src/config-global';

import { NoticeEditView } from '../../../../../sections/notice/view/notice-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `공지사항 - ${CONFIG.site.name}` };

export default async function Page() {
  return <NoticeEditView editMode="create" />;
}
