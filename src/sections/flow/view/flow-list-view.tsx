'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { Flow, FlowFilters } from 'src/types/flow';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { isDeepEqual } from '@mui/x-data-grid/internals';

import { RouterLink } from 'src/routes/components';

import { useGetFlows } from 'src/actions/flow';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { defaultTemplatedFlowFilters } from 'src/types/flow';

import { FlowFilter } from '../flow-filter';
import { paths } from '../../../routes/paths';
import { defaultPagination } from '../../../utils/pagination';
import { DnaPagination } from '../../../components/dna-pagination';

import type { FlowTemplate } from '../../../types/flow-template';

export function FlowListView() {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<FlowFilters>(defaultTemplatedFlowFilters);
  const { data, loading, totalCount, mutate } = useGetFlows(pagination, sortModel, filters);
  const [tableData, setTableData] = useState<Flow[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination]);

  const handleViewRow = useCallback(
    (sid: string) => {
      console.log(sid);
      router.push(paths.flow.flow.details(sid));
    },
    [router]
  );

  const getRowId = (row: FlowTemplate) => row.sid || 0;

  const columns: GridColDef[] = [
    {
      field: 'sid',
      headerName: 'ID',
      minWidth: 200,
    },
    {
      field: 'name',
      headerName: '플로우 명',
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
      field: 'templateName',
      headerName: '템플릿 명',
      flex: 1,
      minWidth: 200,
    },
  ];

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="템플릿 기반 플로우 관리"
        links={[{ name: '템플릿 기반 플로우 관리' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.flow.flow.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            템플릿 기반 플로우 등록
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <FlowFilter
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
          getRowId={getRowId}
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
