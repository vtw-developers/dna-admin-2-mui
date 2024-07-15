'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CtiInfoEditForm } from '../cti-info-edit-form';

import type { EditModes } from '../../../types/edit';
import type { ApiInfo } from '../../../types/api-info';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: ApiInfo;
};

export function CtiInfoEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return 'CTI 정보 등록';
      case 'update':
        return 'CTI 정보 수정';
      case 'details':
        return 'CTI 정보 상세';
      default:
        return 'CTI 정보';
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '관리', href: 'test' }, { name: 'CTI', href: 'test' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CtiInfoEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
