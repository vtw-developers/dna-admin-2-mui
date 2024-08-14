'use client';

import type { BoardEditModes } from 'src/types/edit';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QnaEditForm } from '../qna-edit-form';

import type { Board } from '../../../types/board';

// ----------------------------------------------------------------------

type Props = {
  editMode: BoardEditModes;
  entity?: Board;
  parent?: Board;
};

export function QnaEditView({ editMode, entity, parent }: Props): JSX.Element {
  const title = () => {
    switch (editMode) {
      case 'create':
        return 'QnA 등록';
      case 'update':
        return 'QnA 수정';
      case 'details':
        return 'QnA 상세';
      case 'reply':
        return 'QnA 답글';
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

      <QnaEditForm editMode={editMode} entity={entity} parent={parent} />
    </DashboardContent>
  );
}
