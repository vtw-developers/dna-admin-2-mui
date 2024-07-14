'use client';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ApiInfoNewEditForm } from '../api-info-new-edit-form';

// ----------------------------------------------------------------------

export function ApiInfoCreateView() {
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

      <ApiInfoNewEditForm />
    </DashboardContent>
  );
}
