import { CONFIG } from 'src/config-global';

import { FlowEditView } from '../../../../../sections/flow/view/flow-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `플로우 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <FlowEditView editMode="create" />;
}
