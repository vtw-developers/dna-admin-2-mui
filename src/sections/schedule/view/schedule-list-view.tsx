'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { ApiInfo, ApiInfoFilters } from 'src/types/api-info';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import cronstrue from 'cronstrue/i18n';
import { useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { DashboardContent } from 'src/layouts/dashboard';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { defaultApiInfoFilters } from 'src/types/api-info';

import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';
import { ScheduleFilter } from '../schedule-filter';
import { useGetSchedules } from '../../../actions/schedule';
import { defaultPagination } from '../../../utils/pagination';
import { DnaPagination } from '../../../components/dna-pagination';

export function ScheduleListView() {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<ApiInfoFilters>(defaultApiInfoFilters);
  const { data, loading, totalCount } = useGetSchedules(pagination, sortModel, filters);
  const [tableData, setTableData] = useState<ApiInfo[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination, filters]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.manage.schedule.details(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'serviceGroupName',
      headerName: '서비스그룹',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'ctiInfoName',
      headerName: 'CTI명',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'cronExpr',
      headerName: '스케줄',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const { cronExpr } = params.row;
        const cronExprString = cronExpr ? cronstrue.toString(cronExpr, { locale: 'ko' }) : '미설정';
        return (
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={() => handleViewRow(params.row.ctiInfoId)}
            sx={{ cursor: 'pointer' }}
          >
            {cronExprString}
          </Link>
        );
      },
    },
  ];

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="스케줄"
        links={[{ name: '스케줄' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <ScheduleFilter onSearch={(f) => setFilters(f)} />
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
          getRowId={(row) => row.ctiInfoId}
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
