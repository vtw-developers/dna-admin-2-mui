'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { BoardMaster, BoardMasterFilters } from 'src/types/board-master';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetBoardMasters } from 'src/actions/board-master';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { defaultBoardMasterFilters } from 'src/types/board-master';

import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';
import { BoardMasterFilter } from '../board-master-filter';
import { defaultPagination } from '../../../utils/pagination';
import { DnaPagination } from '../../../components/dna-pagination';

export function BoardMasterListView() {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<BoardMasterFilters>(defaultBoardMasterFilters);
  const { data, loading, totalCount } = useGetBoardMasters(pagination, sortModel, filters);
  const [tableData, setTableData] = useState<BoardMaster[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination, filters]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.manage.board.details(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: '게시판명',
      width: 300,
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
      field: 'instruction',
      headerName: '설명',
      width: 300,
    },
    {
      field: 'fileAttachYn',
      headerName: '파일첨부가능여부',
      width: 200,
      renderCell: (params) => checkBoolean(params.row.fileAttachYn),
    },
    {
      field: 'replyYn',
      headerName: '답장가능여부',
      width: 200,
      renderCell: (params) => checkBoolean(params.row.replyYn),
    },
    {
      field: 'commentYn',
      headerName: '댓글가능여부',
      width: 200,
      renderCell: (params) => checkBoolean(params.row.commentYn),
    },
    {
      field: 'pinYn',
      headerName: '중요표기여부',
      width: 200,
      renderCell: (params) => checkBoolean(params.row.pinYn),
    },
    {
      field: 'popupYn',
      headerName: '게시기간설정여부',
      width: 200,
      renderCell: (params) => checkBoolean(params.row.popupYn),
    },
    {
      field: 'useYn',
      headerName: '사용여부',
      width: 200,
      renderCell: (params) => checkBoolean(params.row.useYn),
    },
    {
      field: 'authorName',
      headerName: '작성자',
      width: 100,
    },
  ];

  const checkBoolean = (item: boolean) => <p>{item ? 'O' : 'X'}</p>;

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="게시판 관리"
        links={[{ name: '게시판 관리' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.manage.board.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            게시판 등록
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <BoardMasterFilter onSearch={(f) => setFilters(f)} />
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
