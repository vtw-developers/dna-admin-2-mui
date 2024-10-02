import { CONFIG } from 'src/config-global';

import { ScheduleEditView } from '../../../../../sections/schedule/view/schedule-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `API 관리 - ${CONFIG.site.name}` };

export default function Page() {
  return <ScheduleEditView editMode="create" />;
}
