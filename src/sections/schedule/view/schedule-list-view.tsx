'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { ApiInfo, ApiInfoFilters } from 'src/types/api-info';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { DashboardContent } from 'src/layouts/dashboard';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { defaultApiInfoFilters } from 'src/types/api-info';

import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';
import { ScheduleFilter } from '../schedule-filter';
import { Iconify } from '../../../components/iconify';
import { RouterLink } from '../../../routes/components';
import { defaultPagination } from '../../../utils/pagination';
import { DnaPagination } from '../../../components/dna-pagination';
import {
  runFlow,
  stopSchedule,
  startSchedule,
  useGetSchedules,
  registerSchedule,
} from '../../../actions/schedule';

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
      field: 'id',
      headerName: 'ID',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'flowSid',
      headerName: 'Flow',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const { flowSid, flowId, flowName } = params.row;
        // const cronExprString = cronExpr ? cronstrue.toString(cronExpr, { locale: 'ko' }) : '미설정';
        return (
          <div>
            {flowName} ({flowId})
          </div>
        );
      },
    },
    {
      field: 'cronExpr',
      headerName: '스케줄',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const { cronExpr } = params.row;
        // const cronExprString = cronExpr ? cronstrue.toString(cronExpr, { locale: 'ko' }) : '미설정';
        return (
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={() => handleViewRow(params.row.id)}
            sx={{ cursor: 'pointer' }}
          >
            {cronExpr}
          </Link>
        );
      },
    },
    {
      field: 'status',
      headerName: '상태',
      minWidth: 200,
      renderCell: (params) => {
        if (!params.row?.status || params.row.status === 'UNREGISTERED') return <div>미등록</div>;
        if (params.row.status === 'PAUSED') return <div>정지</div>;
        if (params.row.status === 'NORMAL') return <div>실행중</div>;
        return <div>{params.row?.status}</div>;
      },
    },
    {
      field: '@actionButtons',
      headerName: '',
      minWidth: 200,
      renderCell: (params) => {
        if (!params.row?.status || params.row.status === 'UNREGISTERED')
          return (
            <Button variant="outlined" onClick={() => register(params.row.id)}>
              등록
            </Button>
          );
        if (params.row?.status === 'PAUSED') {
          return (
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Button variant="outlined" onClick={() => start(params.row.id)}>
                실행
              </Button>
              <Button variant="outlined" onClick={() => run(params.row.id)}>
                즉시 실행
              </Button>
            </Box>
          );
        }
        if (params.row?.status === 'NORMAL') {
          return (
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Button variant="outlined" onClick={() => stop(params.row.id)}>
                정지
              </Button>
              <Button variant="outlined" onClick={() => run(params.row.id)}>
                즉시 실행
              </Button>
            </Box>
          );
        }
      },
    },
  ];

  const updateStatus = (id: any, status: any) => {
    setTableData(
      tableData.map((t) => {
        if (t.id === id) {
          return { ...t, status };
        }
        return t;
      })
    );
  };

  const register = async (id: any) => {
    const result = await registerSchedule({ id });
    updateStatus(id, result.status);
  };

  const start = async (id: any) => {
    const result = await startSchedule({ id });
    updateStatus(id, result.status);
  };

  const stop = async (id: any) => {
    const result = await stopSchedule({ id });
    updateStatus(id, result.status);
  };

  const run = async (id: any) => {
    const result = await runFlow({ id });
    updateStatus(id, result.status);
  };

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="스케줄"
        links={[{ name: '스케줄' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
        action={
          <Button
            component={RouterLink}
            href={paths.manage.schedule.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            스케줄 등록
          </Button>
        }
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
          getRowId={(row) => row.id}
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
