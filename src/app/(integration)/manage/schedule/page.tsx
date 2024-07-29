import { CONFIG } from 'src/config-global';
import { ScheduleListView } from '../../../../sections/schedule/view/schedule-list-view';

// ----------------------------------------------------------------------

export const metadata = { title: `API | ${CONFIG.site.name}` };

export default function Page() {
  return <ScheduleListView />;
}
