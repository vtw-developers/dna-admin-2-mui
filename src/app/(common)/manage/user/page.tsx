import { CONFIG } from 'src/config-global';

import { UserListView } from '../../../../sections/user/view/user-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `User | ${CONFIG.site.name}` };

export default function Page() {
  return <UserListView />;
}
