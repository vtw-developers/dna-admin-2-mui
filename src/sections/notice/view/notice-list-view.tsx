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
import { useRoleContext } from '../../../auth/hooks/use-role-context';
import { CustomBreadcrumbs } from '../../../components/custom-breadcrumbs';

import type { Board } from '../../../types/board';

const NOTICE_BOARD_MASTER_ID = 1;

export const NoticeListView = () => {
  const router = useRouter();
  const { writeRole, setCurrentPath } = useRoleContext();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const { data, loading, totalCount } = useGetBoards(
    pagination,
    sortModel,
    defaultBoardFilters(NOTICE_BOARD_MASTER_ID)
  );
  const [tableData, setTableData] = useState<Board[]>([]);

  useEffect(() => {
    setCurrentPath('/boards/notice');
    setTableData(data);
  }, [data, sortModel, pagination, setCurrentPath]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.boards.notice.details(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'boardNo',
      headerName: '번호',
      flex: 1,
      renderCell: (params) => {
        if (params.row.pinYn) return <Iconify icon="mingcute:pin-line" />;
        return <>{params.row.boardNo}</>;
      },
      cellClassName: (params) => (params.row.pinYn ? 'highlight-row' : ''),
    },
    {
      field: 'title',
      headerName: '제목',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Link
          noWrap
          color="inherit"
          variant="subtitle2"
          onClick={() => handleViewRow(params.row.id)}
          sx={{ cursor: 'pointer' }}
        >
          {params.row.title}
        </Link>
      ),
      cellClassName: (params) => (params.row.pinYn ? 'highlight-row' : ''),
    },
    {
      field: 'authorName',
      headerName: '작성자',
      flex: 1,
      minWidth: 100,
      cellClassName: (params) => (params.row.pinYn ? 'highlight-row' : ''),
    },
    {
      field: 'modifiedTime',
      headerName: '작성일',
      flex: 1,
      minWidth: 100,
      cellClassName: (params) => (params.row.pinYn ? 'highlight-row' : ''),
    },
  ];

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="공지사항"
        links={[{ name: '공지사항 목록' }]}
        actionVisible={writeRole}
        action={
          <Button
            component={RouterLink}
            href={paths.boards.notice.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            공지사항 등록
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
