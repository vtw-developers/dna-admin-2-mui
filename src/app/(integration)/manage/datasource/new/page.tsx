import { CONFIG } from 'src/config-global';

import { DatasourceEditView } from '../../../../../sections/datasource/view/datasource-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `데이터소스 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <DatasourceEditView editMode="create" />;
}
