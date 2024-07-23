import { CONFIG } from 'src/config-global';

import { getBoardMaster } from '../../../../../actions/board-master';
import { BoardMasterEditView } from '../../../../../sections/board-master/view/board-master-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getBoardMaster(id);
  return <BoardMasterEditView editMode="details" entity={entity} />;
}
