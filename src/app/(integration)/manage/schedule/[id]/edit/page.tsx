import { CONFIG } from 'src/config-global';

import { getSchedule } from '../../../../../../actions/schedule';
import { ScheduleEditView } from '../../../../../../sections/schedule/view/schedule-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `스케줄 관리 - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getSchedule(id);

  return <ScheduleEditView editMode="update" entity={entity} />;
}
