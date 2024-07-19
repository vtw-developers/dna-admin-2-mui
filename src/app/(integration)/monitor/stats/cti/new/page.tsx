import { CONFIG } from 'src/config-global';

import { CtiInfoEditView } from '../../../../../sections/cti-info/view/cti-info-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <CtiInfoEditView editMode="create" />;
}
