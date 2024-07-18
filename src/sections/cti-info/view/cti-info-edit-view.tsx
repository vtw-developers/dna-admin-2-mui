'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { CtiInfoEditForm } from '../cti-info-edit-form';

import type { EditModes } from '../../../types/edit';
import type { CtiInfo } from '../../../types/cti-info';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: CtiInfo;
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
        links={[{ name: 'CTI 관리', href: '/manage/cti' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CtiInfoEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
