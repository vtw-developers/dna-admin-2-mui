import { CONFIG } from 'src/config-global';

import { getMenuList } from '../../../../actions/menu';
import { MenuEditView } from '../../../../sections/menu/menu-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Menu - ${CONFIG.site.name}` };

export default async function Page() {
  const entity = await getMenuList();
  return <MenuEditView entity={entity} />;
}
