import { CONFIG } from 'src/config-global';

import { FlowTemplateListView } from '../../../../sections/flow-template/view/flow-template-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `플로우 템플릿 | ${CONFIG.site.name}` };

export default function Page() {
  return <FlowTemplateListView />;
}
