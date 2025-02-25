import { CONFIG } from 'src/config-global';

import { getTemplatedFlow } from '../../../../../actions/flow';
import { FlowEditView } from '../../../../../sections/flow/view/flow-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `플로우 관리- ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getTemplatedFlow(id);
  return <FlowEditView editMode="details" entity={entity} />;
}
