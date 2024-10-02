import { CONFIG } from 'src/config-global';

import { DatasourceListView } from '../../../../sections/datasource/view/datasource-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Datasource | ${CONFIG.site.name}` };

export default function Page() {
  return <DatasourceListView />;
}
