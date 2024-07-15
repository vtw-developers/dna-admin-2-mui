import { CONFIG } from 'src/config-global';

import { ServiceGroupEditView } from '../../../../../sections/service-group/view/service-group-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ServiceGroupEditView editMode="create" />;
}
