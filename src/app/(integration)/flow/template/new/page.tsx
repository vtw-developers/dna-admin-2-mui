import { CONFIG } from 'src/config-global';

import { FlowTemplateEditView } from '../../../../../sections/flow-template/view/flow-template-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `API 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <FlowTemplateEditView editMode="create" />;
}
