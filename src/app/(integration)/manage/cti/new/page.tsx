import { CONFIG } from 'src/config-global';

import { CtiInfoEditView } from '../../../../../sections/cti-info/view/cti-info-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `CTI 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <CtiInfoEditView editMode="create" />;
}
