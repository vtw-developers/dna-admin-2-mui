import { CONFIG } from 'src/config-global';

import { getMenuList } from '../../../../actions/menu';
import { MenuEditView } from '../../../../sections/menu/menu-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `메뉴 관리 - ${CONFIG.site.name}` };

export default async function Page() {
  const entity = await getMenuList();
  return <MenuEditView entity={entity} />;
}
