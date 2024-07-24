import { CONFIG } from 'src/config-global';

import { QnaEditView } from '../../../../../sections/qna/view/qna-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `QnA - ${CONFIG.site.name}` };

export default async function Page() {
  return <QnaEditView editMode="create" />;
}
