'use client';

import type { ApiInfoFilters, ApiInfoItem } from 'src/types/api-info';
import { DataGrid, gridClasses, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { RouterLink } from 'src/routes/components';
import { useGetApiInfos } from 'src/actions/api-info';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';
import { ApiInfoFilter } from '../api-info-filter';
import { DnaPagination } from '../../../components/dna-pagination';

export function ApiInfoListView() {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [filters, setFilters] = useState<ApiInfoFilters>({ name: '' });
  const { data, loading, totalCount } = useGetApiInfos(pagination, filters);
  const [tableData, setTableData] = useState<ApiInfoItem[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination, filters]);

  const columns: GridColDef[] = [
    {
      field: 'serviceGroupName',
      headerName: '서비스그룹',
    },
    {
      field: 'name',
      headerName: 'API명',
    },
    {
      field: 'httpMethod',
      headerName: 'Method',
    },
    {
      field: 'url',
      headerName: 'URL',
    },
    {
      field: 'enabled',
      headerName: '사용여부',
    },
  ];

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
              href={'test'}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              API 등록
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <ApiInfoFilter onSearch={(filters) => setFilters(filters)} />
        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            disableRowSelectionOnClick
            rows={tableData}
            columns={columns}
            loading={loading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
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
    </>
  );
}
