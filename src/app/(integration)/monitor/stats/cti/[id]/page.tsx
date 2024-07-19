import { CONFIG } from 'src/config-global';

import { getApiInfo } from '../../../../../actions/api-info';
import { CtiInfoEditView } from '../../../../../sections/cti-info/view/cti-info-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getApiInfo(id);

  return <CtiInfoEditView editMode="details" entity={entity} />;
}
