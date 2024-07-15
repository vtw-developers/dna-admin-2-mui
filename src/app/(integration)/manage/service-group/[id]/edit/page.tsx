import { CONFIG } from 'src/config-global';

import { getApiInfo } from '../../../../../../actions/api-info';
import { ServiceGroupEditView } from '../../../../../../sections/service-group/view/service-group-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getApiInfo(id);

  return <ServiceGroupEditView editMode="update" entity={entity} />;
}
