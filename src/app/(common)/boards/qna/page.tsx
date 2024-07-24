import { CONFIG } from 'src/config-global';

import { QnaListView } from '../../../../sections/qna/view/qna-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `QnA | ${CONFIG.site.name}` };

export default function Page() {
  return <QnaListView />;
}
