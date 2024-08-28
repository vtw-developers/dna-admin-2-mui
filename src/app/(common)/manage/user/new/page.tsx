import { CONFIG } from 'src/config-global';

import { UserEditView } from '../../../../../sections/user/view/user-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `사용자 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <UserEditView editMode="create" />;
}
