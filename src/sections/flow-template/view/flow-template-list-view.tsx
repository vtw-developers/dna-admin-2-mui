'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { FlowTemplate, FlowTemplateFilters } from 'src/types/flow-template';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { isDeepEqual } from '@mui/x-data-grid/internals';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetFlowTemplates } from 'src/actions/flow-template';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { defaultFlowTemplateFilters } from 'src/types/flow-template';

import { paths } from '../../../routes/paths';
import { FlowTemplateFilter } from '../flow-template-filter';
import { defaultPagination } from '../../../utils/pagination';
import { DnaPagination } from '../../../components/dna-pagination';

export function FlowTemplateListView() {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<FlowTemplateFilters>(defaultFlowTemplateFilters);
  const { data, loading, totalCount, mutate } = useGetFlowTemplates(pagination, sortModel, filters);
  const [tableData, setTableData] = useState<FlowTemplate[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination]);

  const handleViewRow = useCallback(
    (id: string) => {
      console.log(id);
      router.push(paths.flow.template.details(id));
    },
    [router]
  );

  const getRowId = (row: FlowTemplate) => row.sid || 0;

  const columns: GridColDef[] = [
    {
      field: 'flowType',
      headerName: '유형',
      width: 100,
    },
    {
      field: 'name',
      headerName: '템플릿명',
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
      field: 'templateId',
      headerName: '템플릿ID',
      flex: 1,
      minWidth: 200,
    },
  ];

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="플로우 템플릿 관리"
        links={[{ name: '플로우 템플릿 관리' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.flow.template.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            플로우 템플릿 등록
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <FlowTemplateFilter
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
          getRowId={getRowId}
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
