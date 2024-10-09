import { CONFIG } from 'src/config-global';

import { FlowListView } from '../../../../sections/flow/view/flow-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `플로우 | ${CONFIG.site.name}` };

export default function Page() {
  return <FlowListView />;
}
