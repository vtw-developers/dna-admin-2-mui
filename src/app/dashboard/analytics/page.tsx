import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView } from '../../../sections/analysics/view/overview-analytics-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Analytics | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <OverviewAnalyticsView />;
}
