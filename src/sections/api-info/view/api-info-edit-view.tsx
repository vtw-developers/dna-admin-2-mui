'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ApiInfoEditForm } from '../api-info-edit-form';

import type { EditModes } from '../../../types/edit';
import type { ApiInfo } from '../../../types/api-info';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: ApiInfo;
};

export function ApiInfoEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return 'API 정보 등록';
      case 'update':
        return 'API 정보 수정';
      case 'details':
        return 'API 정보 상세';
      default:
        return 'API 정보';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: 'API 관리', href: '/manage/api/' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ApiInfoEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
