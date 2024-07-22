import { CONFIG } from 'src/config-global';

import { getPageInfo } from '../../../../../actions/page-info';
import { PageInfoEditView } from '../../../../../sections/page-info/view/page-info-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getPageInfo(id);
  return <PageInfoEditView editMode="details" entity={entity} />;
}
