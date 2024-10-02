import { CONFIG } from 'src/config-global';

import { getDatasource } from '../../../../../../actions/datasource';
import { DatasourceEditView } from '../../../../../../sections/datasource/view/datasource-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `데이터소스 관리 - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getDatasource(id);

  return <DatasourceEditView editMode="update" entity={entity} />;
}
