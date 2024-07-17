import { CONFIG } from 'src/config-global';

import { ServiceGroupListView } from '../../../../sections/service-group/view/service-group-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Service Group | ${CONFIG.site.name}` };

export default function Page() {
  return <ServiceGroupListView />;
}
