import { CONFIG } from 'src/config-global';

import { getFlowTemplate } from '../../../../../actions/flow-template';
import { FlowTemplateEditView } from '../../../../../sections/flow-template/view/flow-template-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `플로우 템플릿 관리- ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getFlowTemplate(id);
  return <FlowTemplateEditView editMode="details" entity={entity} />;
}
