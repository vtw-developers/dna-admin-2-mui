import { CONFIG } from 'src/config-global';

import { TemplatedFlowEditView } from '../../../../../sections/templated-flow/view/templated-flow-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `템플릿 기반 플로우 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <TemplatedFlowEditView editMode="create" />;
}
