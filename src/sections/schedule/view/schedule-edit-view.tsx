'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ScheduleEditForm } from '../schedule-edit-form';

import type { EditModes } from '../../../types/edit';
import type { ApiInfo } from '../../../types/api-info';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: ApiInfo;
};

export function ScheduleEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return '스케줄 등록';
      case 'update':
        return '스케줄 수정';
      case 'details':
        return '스케줄 상세';
      default:
        return '스케줄';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '스케줄', href: '/manage/schedule/' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ScheduleEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
