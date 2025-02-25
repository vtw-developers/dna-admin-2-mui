'use client';

import type { GridColDef } from '@mui/x-data-grid';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from '../../../routes/paths';
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
  }, [data, sortModel, pagination]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.boards.qna.details(id));
    },
    [router]
  );

  const replySpace = (board: Board) => {
    const spaces = [];
    const level = replyLevel(board);
    for (let i = 0; i < level - 1; i + 1) {
      spaces.push(<div style={{ float: 'left' }}>&ensp;&ensp;&ensp;</div>);
    }
    return spaces;
  };

  const replyLevel = (board: Board, level?: number): number => {
    if (!level) {
      level = 0;
    }
    if (board?.parentId) {
      level += 1;
      const parent = data.find((row) => row.id === board.parentId);
      if (parent) {
        level = replyLevel(parent, level);
      }
    }

    return level;
  };

  const columns: GridColDef[] = [
    {
      field: 'boardNo',
      headerName: '번호',
      minWidth: 150,
    },
    {
      field: 'title',
      headerName: '제목',
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
          {replySpace(params.row)}
          {replyLevel(params.row) > 0 && (
            <img
              style={{ float: 'left', paddingRight: '8px' }}
              src="/icons/board/reply.svg"
              alt="reply"
            />
          )}
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
