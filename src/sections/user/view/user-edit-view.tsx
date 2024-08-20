'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserEditForm } from '../user-edit-form';

import type { User } from '../../../types/user';
import type { EditModes } from '../../../types/edit';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: User;
};

export function UserEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return '사용자 정보 등록';
      case 'update':
        return '사용자 정보 수정';
      case 'details':
        return '사용자 정보 상세';
      default:
        return '사용자 정보';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '사용자 관리', href: '/manage/user/' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
