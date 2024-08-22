'use client';

import { useEffect } from 'react';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NoticeEditForm } from '../notice-edit-form';
import { useRoleContext } from '../../../auth/hooks/use-role-context';

import type { Board } from '../../../types/board';
import type { EditModes } from '../../../types/edit';

// ----------------------------------------------------------------------

type Props = {
  editMode: EditModes;
  entity?: Board;
};

export function NoticeEditView({ editMode, entity }: Props): JSX.Element {
  const { setCurrentPath } = useRoleContext();

  useEffect(() => {
    setCurrentPath('/boards/notice');
  }, [setCurrentPath]);

  const title = () => {
    switch (editMode) {
      case 'create':
        return '공지사항 등록';
      case 'update':
        return '공지사항 수정';
      case 'details':
        return '공지사항 상세';
      default:
        return '공지사항';
    }
  };
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={title()}
        links={[{ name: '공지사항', href: '/boards/notice/' }, { name: title() }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <NoticeEditForm editMode={editMode} entity={entity} />
    </DashboardContent>
  );
}
