import { CONFIG } from 'src/config-global';

import { OverviewAnalyticsView } from '../../sections/analysics/view/overview-analytics-view';

// ----------------------------------------------------------------------

export const metadata = { title: `대시보드 - ${CONFIG.site.name}` };

export default function Page() {
  return <OverviewAnalyticsView />;
}
