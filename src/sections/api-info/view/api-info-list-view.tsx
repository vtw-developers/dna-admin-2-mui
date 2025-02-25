'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { ApiInfo, ApiInfoFilters } from 'src/types/api-info';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { RouterLink } from 'src/routes/components';

import { useGetApiInfos } from 'src/actions/api-info';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { defaultApiInfoFilters } from 'src/types/api-info';

import { paths } from '../../../routes/paths';
import { ApiInfoFilter } from '../api-info-filter';
import { defaultPagination } from '../../../utils/pagination';
import { DnaPagination } from '../../../components/dna-pagination';

export function ApiInfoListView() {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<ApiInfoFilters>(defaultApiInfoFilters);
  const { data, loading, totalCount, mutate } = useGetApiInfos(pagination, sortModel, filters);
  const [tableData, setTableData] = useState<ApiInfo[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination]);

  const handleViewRow = useCallback(
    (sid: string) => {
      router.push(paths.manage.api.details(sid));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'serviceGroupName',
      headerName: '서비스그룹',
      minWidth: 200,
    },
    {
      field: 'name',
      headerName: 'API명',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Link
          noWrap
          color="inherit"
          variant="subtitle2"
          onClick={() => handleViewRow(params.row.sid)}
          sx={{ cursor: 'pointer' }}
        >
          {params.row.name}
        </Link>
      ),
    },
    {
      field: 'httpMethod',
      headerName: 'Method',
      minWidth: 100,
    },
    {
      field: 'url',
      headerName: 'URL',
      minWidth: 200,
    },
    {
      field: 'enabled',
      headerName: '사용여부',
      renderCell: (params) => (params.row.enabled ? 'O' : 'X'),
      align: 'center',
    },
  ];

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="API 관리"
        links={[{ name: 'API 관리' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.manage.api.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            API 등록
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <ApiInfoFilter
          onSearch={(f) => {
            setFilters(f);
            if (isDeepEqual(filters, f)) {
              mutate();
            }
          }}
        />
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
