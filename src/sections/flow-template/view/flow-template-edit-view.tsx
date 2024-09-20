'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { FlowTemplateEditForm } from '../flow-template-edit-form';

import type { EditModes } from '../../../types/edit';
import type { FlowTemplate } from '../../../types/flow-template';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: FlowTemplate;
};

export function FlowTemplateEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return '플로우 템플릿 등록';
      case 'update':
        return '플로우 템플릿 수정';
      case 'details':
        return '플로우 템플릿 상세';
      default:
        return '플로우 템플릿';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '플로우 템플릿 관리', href: '/flow/template/' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FlowTemplateEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
