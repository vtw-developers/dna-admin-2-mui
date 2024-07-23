'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BoardMasterEditForm } from '../board-master-edit-form';

import type { EditModes } from '../../../types/edit';
import type { ApiInfo } from '../../../types/api-info';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: ApiInfo;
};

export function BoardMasterEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return '게시판 정보 등록';
      case 'update':
        return '게시판 정보 수정';
      case 'details':
        return '게시판 정보 상세';
      default:
        return '게시판 정보';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '게시판 관리', href: '/manage/board/' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <BoardMasterEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
