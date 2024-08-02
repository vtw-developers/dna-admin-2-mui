'use client';

// ----------------------------------------------------------------------

import React from 'react';

import { MenuEditTree } from './menu-edit-tree';
import { DashboardContent } from '../../layouts/dashboard';
import { CustomBreadcrumbs } from '../../components/custom-breadcrumbs';

import type { Menu } from '../../types/menu';

type Props = {
  entity?: Menu[];
};

export function MenuEditView({ entity }: Props): JSX.Element {
  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="메뉴관리"
        links={[{ name: '메뉴관리' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MenuEditTree entity={entity} />
    </DashboardContent>
  );
}
