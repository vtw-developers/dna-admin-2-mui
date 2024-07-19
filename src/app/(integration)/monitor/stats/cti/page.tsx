import { CONFIG } from 'src/config-global';

import { BlankView } from '../../../../../sections/blank/view';

// ----------------------------------------------------------------------

export const metadata = { title: `CTI | ${CONFIG.site.name}` };

export default function Page() {
  return <BlankView />;
}
