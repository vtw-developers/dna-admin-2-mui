'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ApiInfoEditForm } from '../api-info-edit-form';

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
};

export function ApiInfoEditView({ editMode }: Props): JSX.Element {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new product"
        links={[
          { name: 'Dashboard', href: 'test' },
          { name: 'Product', href: 'test' },
          { name: 'New product' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ApiInfoEditForm editMode={editMode} />
    </DashboardContent>
  );
}
