'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { ApiInfo, ApiInfoFilters } from 'src/types/api-info';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { RouterLink } from 'src/routes/components';

import { useGetApiInfos } from 'src/actions/api-info';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { defaultApiInfoFilters } from 'src/types/api-info';

import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';
import { ApiInfoFilter } from '../api-info-filter';
import { defaultPagination } from '../../../utils/pagination';
import { DnaPagination } from '../../../components/dna-pagination';

export function ApiInfoListView() {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<ApiInfoFilters>(defaultApiInfoFilters);
  const { data, loading, totalCount } = useGetApiInfos(pagination, sortModel, filters);
  const [tableData, setTableData] = useState<ApiInfo[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination, filters]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.manage.api.details(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'serviceGroupName',
      headerName: '서비스그룹',
      width: 400,
    },
    {
      field: 'name',
      headerName: 'API명',
      width: 800,
      renderCell: (params) => (
        <Link
          noWrap
          color="inherit"
          variant="subtitle2"
          onClick={() => handleViewRow(params.row.id)}
          sx={{ cursor: 'pointer' }}
        >
          {params.row.name}
        </Link>
      ),
    },
    {
      field: 'httpMethod',
      headerName: 'Method',
      width: 200,
    },
    {
      field: 'url',
      headerName: 'URL',
      width: 400,
    },
    {
      field: 'enabled',
      headerName: '사용여부',
    },
  ];

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="API 목록"
        links={[
          { name: '관리', href: 'test' },
          { name: 'API', href: 'test' },
          { name: 'API 목록' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.manage.api.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            API 등록
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <ApiInfoFilter onSearch={(f) => setFilters(f)} />
      </Card>
      <Card
        className="list-grid"
        sx={{
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          height: { xs: 800, md: 2 },
          flexDirection: { md: 'column' },
          borderRadius: '5px',
        }}
      >
        <DataGrid
          disableRowSelectionOnClick
          rows={tableData}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          sortingMode="server"
          paginationMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          slots={{
            pagination: () => (
              <DnaPagination
                totalCount={totalCount}
                pagination={pagination}
                setPagination={setPagination}
              />
            ),
            noRowsOverlay: () => <EmptyContent />,
            noResultsOverlay: () => <EmptyContent title="No results found" />,
          }}
          rowCount={totalCount}
          sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
        />
      </Card>
    </DashboardContent>
  );
}
