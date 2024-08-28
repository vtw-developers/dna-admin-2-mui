import { CONFIG } from 'src/config-global';

import { getUser } from '../../../../../../actions/user';
import { UserEditView } from '../../../../../../sections/user/view/user-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `사용자 관리 - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getUser(id);

  return <UserEditView editMode="update" entity={entity} />;
}
