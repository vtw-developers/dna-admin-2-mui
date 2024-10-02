'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { paths } from '../../../routes/paths';
import { DatasourceFilter } from '../datasource-filter';
import { defaultPagination } from '../../../utils/pagination';
import { useGetDatasources } from '../../../actions/datasource';
import { DnaPagination } from '../../../components/dna-pagination';
import { defaultDatasourceFilters } from '../../../types/datasource';

import type { Datasource, DatasourceFilters } from '../../../types/datasource';

export function DatasourceListView() {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<DatasourceFilters>(defaultDatasourceFilters);
  const { data, loading, totalCount } = useGetDatasources(pagination, sortModel, filters);
  const [tableData, setTableData] = useState<Datasource[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination, filters]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.manage.datasource.details(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: '데이터소스 이름',
      minWidth: 200,
      flex: 1,
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
      field: 'database',
      headerName: '데이터베이스',
      minWidth: 500,
      flex: 1,
    },
    {
      field: 'url',
      headerName: 'url',
      minWidth: 200,
      flex: 1,
    },
  ];

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="데이터소스 관리"
        links={[{ name: '데이터소스 관리' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.manage.datasource.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            데이터소스 등록
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <DatasourceFilter onSearch={(f) => setFilters(f)} />
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
