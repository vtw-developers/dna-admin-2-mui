'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';
import { Iconify } from '../../../components/iconify';
import { useGetBoards } from '../../../actions/board';
import { RouterLink } from '../../../routes/components';
import { defaultBoardFilters } from '../../../types/board';
import { defaultPagination } from '../../../utils/pagination';
import { DashboardContent } from '../../../layouts/dashboard';
import { EmptyContent } from '../../../components/empty-content';
import { DnaPagination } from '../../../components/dna-pagination';
import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';

import type { Board } from '../../../types/board';

const QNA_BOARD_MASTER_ID = 3;

export const QnaListView = () => {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const { data, loading, totalCount } = useGetBoards(
    pagination,
    sortModel,
    defaultBoardFilters(QNA_BOARD_MASTER_ID)
  );
  const [tableData, setTableData] = useState<Board[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination, defaultBoardFilters]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.boards.qna.details(id));
    },
    [router]
  );

  function replyLevel(board, level?) {
    if (!level) {
      level = 0;
    }
    if (board?.parentId) {
      level += 1;
      const parent = data.find((row) => row.id === board.parentId);
      if (parent) {
        console.log(parent);
        level = replyLevel(parent, level);
      }
    }

    return level;
  }

  const columns: GridColDef[] = [
    {
      field: 'boardNo',
      headerName: '번호',
      width: 200,
    },
    {
      field: 'title',
      headerName: '제목',
      width: 1200,
      renderCell: (params) => (
        <Link
          noWrap
          color="inherit"
          variant="subtitle2"
          onClick={() => handleViewRow(params.row.id)}
          sx={{ cursor: 'pointer' }}
        >
          <div style={{ float: 'left' }}>&ensp;</div>
          <div style={{ float: 'left' }}>
            {replyLevel(params.row) ? `[R${replyLevel(params.row)}]  ` : ''}
          </div>
          <div style={{ float: 'left' }}> {params.row.title}</div>
        </Link>
      ),
    },
    {
      field: 'authorName',
      headerName: '작성자',
      width: 200,
    },
    {
      field: 'modifiedTime',
      headerName: '작성일',
      width: 200,
    },
  ];

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="QnA"
        links={[{ name: 'QnA' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.boards.qna.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            게시글 등록
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
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
};
