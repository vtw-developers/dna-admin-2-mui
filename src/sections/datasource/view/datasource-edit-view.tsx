'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DatasourceEditForm } from '../datasource-edit-form';

import type { EditModes } from '../../../types/edit';
import type { Datasource } from '../../../types/datasource';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: Datasource;
};

export function DatasourceEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return '데이터소스 정보 등록';
      case 'update':
        return '데이터소스 정보 수정';
      case 'details':
        return '데이터소스 정보 상세';
      default:
        return '데이터소스 정보';
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '데이터소스 관리', href: '/manage/datasource' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DatasourceEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
