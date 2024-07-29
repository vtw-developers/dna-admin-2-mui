import { CONFIG } from 'src/config-global';

import { getSchedule } from '../../../../../../actions/schedule';
import { ApiInfoEditView } from '../../../../../../sections/api-info/view/api-info-edit-view';
import { ScheduleEditView } from '../../../../../../sections/schedule/view/schedule-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = params;

  const entity = await getSchedule(id);

  return <ScheduleEditView editMode="update" entity={entity} />;
}
