import { CONFIG } from 'src/config-global';

import { ApiInfoCreateView } from '../../../../../sections/api-info/view/api-info-create-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ApiInfoCreateView />;
}
