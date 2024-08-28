import { CONFIG } from 'src/config-global';

import { ServiceGroupEditView } from '../../../../../sections/service-group/view/service-group-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `서비스 그룹 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <ServiceGroupEditView editMode="create" />;
}
