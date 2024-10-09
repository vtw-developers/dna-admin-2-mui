'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FlowEditForm } from '../flow-edit-form';

import type { Flow } from '../../../types/flow';
import type { EditModes } from '../../../types/edit';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: Flow;
};

export function FlowEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return '플로우 정보 등록';
      case 'update':
        return '플로우 정보 수정';
      case 'details':
        return '플로우 정보 상세';
      default:
        return '플로우 정보';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '플로우 관리', href: '/flow/flow' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FlowEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
