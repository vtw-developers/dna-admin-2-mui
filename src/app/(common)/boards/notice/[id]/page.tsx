import { CONFIG } from 'src/config-global';

import { getBoard } from '../../../../../actions/board';
import { NoticeEditView } from '../../../../../sections/notice/view/notice-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Notice - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getBoard(id);
  console.log(entity);
  return <NoticeEditView editMode="details" entity={entity} />;
}
