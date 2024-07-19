import { CONFIG } from 'src/config-global';

import { ApiInfoEditView } from '../../../../../sections/api-info/view/api-info-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ApiInfoEditView editMode="create" />;
}
