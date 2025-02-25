import { CONFIG } from 'src/config-global';

import { getBoard } from '../../../../../actions/board';
import { QnaEditView } from '../../../../../sections/qna/view/qna-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `QnA - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getBoard(id);
  return <QnaEditView editMode="details" entity={entity} />;
}
