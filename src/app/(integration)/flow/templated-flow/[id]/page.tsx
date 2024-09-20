import { CONFIG } from 'src/config-global';

import { getTemplatedFlow } from '../../../../../actions/templated-flow';
import { TemplatedFlowEditView } from '../../../../../sections/templated-flow/view/templated-flow-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `템플릿 기반 플로우 관리- ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getTemplatedFlow(id);
  return <TemplatedFlowEditView editMode="details" entity={entity} />;
}
