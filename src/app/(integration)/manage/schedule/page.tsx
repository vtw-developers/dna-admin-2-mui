import { CONFIG } from 'src/config-global';

import { ApiInfoListView } from '../../../../sections/api-info/view/api-info-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `API | ${CONFIG.site.name}` };

export default function Page() {
  return <ApiInfoListView />;
}
