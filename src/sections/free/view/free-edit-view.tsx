'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { BoardComment } from '../board-comment';
import { FreeEditForm } from '../free-edit-form';

import type { Board } from '../../../types/board';
import type { EditModes } from '../../../types/edit';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: Board;
};

export function FreeEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return '자유게시판 등록';
      case 'update':
        return '게시글 수정';
      case 'details':
        return '게시글 상세';
      default:
        return '자유게시판';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '자유게시판', href: '/boards/free/' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FreeEditForm editMode={editMode} entity={entity} />
      {editMode === 'details' && entity && <BoardComment boardId={entity?.id} />}
    </DashboardContent>
  );
}
