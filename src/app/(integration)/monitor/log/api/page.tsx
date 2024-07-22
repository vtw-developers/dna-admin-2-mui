import { CONFIG } from 'src/config-global';

import { ApiLogListView } from '../../../../../sections/api-log/view/api-log-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `API | ${CONFIG.site.name}` };

export default function Page() {
  return <ApiLogListView />;
}
