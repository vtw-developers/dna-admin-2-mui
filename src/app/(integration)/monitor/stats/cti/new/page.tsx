import { CONFIG } from 'src/config-global';

import { BlankView } from '../../../../../../sections/blank/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <BlankView />;
}
