import { CONFIG } from 'src/config-global';

import { UserEditView } from '../../../../../sections/user/view/user-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `User - ${CONFIG.site.name}` };

export default function Page() {
  return <UserEditView editMode="create" />;
}
