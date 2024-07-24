'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QnaEditForm } from '../qna-edit-form';

import type { Board } from '../../../types/board';
import type { EditModes } from '../../../types/edit';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: Board;
};

export function QnaEditView({ editMode, entity }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return 'QnA 등록';
      case 'update':
        return '게시글 수정';
      case 'details':
        return '게시글 상세';
      default:
        return 'QnA';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: 'QnA', href: '/boards/qna/' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <QnaEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
