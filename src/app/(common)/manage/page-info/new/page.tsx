import { CONFIG } from 'src/config-global';

import { PageInfoEditView } from '../../../../../sections/page-info/view/page-info-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `페이지 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <PageInfoEditView editMode="create" />;
}
