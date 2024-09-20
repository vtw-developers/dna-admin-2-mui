import { CONFIG } from 'src/config-global';

import { TemplatedFlowListView } from '../../../../sections/templated-flow/view/templated-flow-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `템플릿 기반 플로우 | ${CONFIG.site.name}` };

export default function Page() {
  return <TemplatedFlowListView />;
}
