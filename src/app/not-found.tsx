import { CONFIG } from 'src/config-global';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export const metadata = { title: `404 | Error - ${CONFIG.site.name}` };

export default function Page() {
  return <NotFoundView />;
}
