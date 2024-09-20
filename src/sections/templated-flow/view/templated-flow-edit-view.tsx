'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TemplatedFlowEditForm } from '../templated-flow-edit-form';

import type { EditModes } from '../../../types/edit';
import type { TemplatedFlow } from '../../../types/templated-flow';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: TemplatedFlow;
};

export function TemplatedFlowEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return '템플릿 기반 플로우 정보 등록';
      case 'update':
        return '템플릿 기반 플로우 정보 수정';
      case 'details':
        return '템플릿 기반 플로우 정보 상세';
      default:
        return '템플릿 기반 플로우 정보';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[
          { name: '템플릿 기반 플로우 관리', href: '/flow/templated-flow' },
          { name: title() },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TemplatedFlowEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
