import { CONFIG } from 'src/config-global';

import { getApiInfo } from '../../../../../actions/api-info';
import { ApiInfoEditView } from '../../../../../sections/api-info/view/api-info-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `API 관리- ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getApiInfo(id);
  return <ApiInfoEditView editMode="details" entity={entity} />;
}
