import { CONFIG } from 'src/config-global';

import { getMenuView } from '../../../../actions/menu';
import { MenuEditView } from '../../../../sections/menu/menu-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Menu - ${CONFIG.site.name}` };

export default async function Page() {
  const entity = await getMenuView();
  return <MenuEditView entity={entity} />;
}
