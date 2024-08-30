'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { ApiLog, ApiLogFilters } from 'src/types/api-log';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { useGetApiLogs } from 'src/actions/api-log';
import { DashboardContent } from 'src/layouts/dashboard';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { defaultApiLogFilters } from 'src/types/api-log';

import { paths } from '../../../routes/paths';
import { ApiLogFilter } from '../api-log-filter';
import { useRouter } from '../../../routes/hooks';
import { defaultPagination } from '../../../utils/pagination';
import { DnaPagination } from '../../../components/dna-pagination';

export function ApiLogListView() {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<ApiLogFilters>(defaultApiLogFilters);
  const { data, loading, totalCount, mutate } = useGetApiLogs(pagination, sortModel, filters);
  const [tableData, setTableData] = useState<ApiLog[]>([]);

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
      field: 'messageId',
      headerName: '메시지ID',
      width: 400,
    },
    {
      field: 'apiInfoName',
      headerName: 'API명',
      width: 800,
    },
    {
      field: 'result',
      headerName: '결과',
      width: 200,
      renderCell: (params) => (
        <Link
          noWrap
          color="inherit"
          variant="subtitle2"
          onClick={() => handleViewRow(params.row.id)}
          sx={{ cursor: 'pointer' }}
        >
          {params.row.result}
        </Link>
      ),
    },
    {
      field: 'errorMessage',
      headerName: '오류내용',
      width: 400,
    },
    {
      field: 'timestamp',
      headerName: '연계시각',
    },
    {
      field: 'elapsedTime',
      headerName: '경과시간(ms)',
    },
  ];

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="API 로그"
        links={[{ name: 'API 로그' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <ApiLogFilter
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
          getRowId={(row) => row.messageId}
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
