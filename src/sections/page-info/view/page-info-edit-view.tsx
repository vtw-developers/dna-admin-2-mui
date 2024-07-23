'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PageInfoEditForm } from '../page-info-edit-form';

import type { EditModes } from '../../../types/edit';
import type { PageInfo } from '../../../types/page-info';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: PageInfo;
};

export function PageInfoEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return 'Page 정보 등록';
      case 'update':
        return 'Page 정보 수정';
      case 'details':
        return 'Page 정보 상세';
      default:
        return 'Page 정보';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: 'Page 관리', href: '/manage/page-info/' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PageInfoEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
