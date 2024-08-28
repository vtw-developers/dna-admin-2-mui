import { CONFIG } from 'src/config-global';

import { ApiStatsView } from 'src/sections/api-stats/view/api-stats-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Blank | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <ApiStatsView />;
}
