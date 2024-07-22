import { CONFIG } from 'src/config-global';

import { PageInfoEditView } from '../../../../../sections/page-info/view/page-info-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page - ${CONFIG.site.name}` };

export default function Page() {
  return <PageInfoEditView editMode="create" />;
}
