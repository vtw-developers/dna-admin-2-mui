import { CONFIG } from 'src/config-global';

import { getBoard } from '../../../../../../actions/board';
import { FreeEditView } from '../../../../../../sections/free/view/free-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `자유게시판 - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getBoard(id);
  return <FreeEditView editMode="update" entity={entity} />;
}
