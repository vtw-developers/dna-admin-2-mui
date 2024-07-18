'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ServiceGroupEditForm } from '../service-group-edit-form';

import type { EditModes } from '../../../types/edit';
import type { ServiceGroup } from '../../../types/service-group';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: ServiceGroup;
};

export function ServiceGroupEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return '서비스그룹 정보 등록';
      case 'update':
        return '서비스그룹 정보 수정';
      case 'details':
        return '서비스그룹 정보 상세';
      default:
        return '서비스그룹 정보';
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '서비스그룹 관리', href: '/manage/service-group' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ServiceGroupEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
