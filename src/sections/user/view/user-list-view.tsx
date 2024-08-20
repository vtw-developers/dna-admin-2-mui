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

import { DashboardContent } from 'src/layouts/dashboard';

import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserFilter } from '../user-filter';
import { paths } from '../../../routes/paths';
import { toast } from '../../../components/snackbar';
import { Iconify } from '../../../components/iconify';
import { RouterLink } from '../../../routes/components';
import { useBoolean } from '../../../hooks/use-boolean';
import { defaultUserFilters } from '../../../types/user';
import { defaultPagination } from '../../../utils/pagination';
import { approveUser, useGetUsers } from '../../../actions/user';
import { ConfirmDialog } from '../../../components/custom-dialog';
import { DnaPagination } from '../../../components/dna-pagination';

import type { User, UserFilters } from '../../../types/user';

export function UserListView() {
  const router = useRouter();

  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [approvalId, setApprovalId] = useState<string>('');
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<UserFilters>(defaultUserFilters);
  const { data, loading, totalCount, mutate } = useGetUsers(pagination, sortModel, filters);
  const confirm = useBoolean();

  const [tableData, setTableData] = useState<User[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination, filters]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.manage.user.details(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 400,
      renderCell: (params) => (
        <Link
          noWrap
          color="inherit"
          variant="subtitle2"
          onClick={() => handleViewRow(params.row.id)}
          sx={{ cursor: 'pointer' }}
        >
          {params.row.id}
        </Link>
      ),
    },
    {
      field: 'name',
      headerName: '이름',
      width: 400,
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
      field: 'roleName',
      flex: 1,
      headerName: '역할',
      width: 200,
    },
    {
      field: 'approval',
      flex: 1,
      headerName: '승인여부',
      renderCell: (params) => (
        <strong>
          {params.row.approval ? (
            '승인완료'
          ) : (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={() => {
                setApprovalId(params.row.id);
                confirm.onTrue();
              }}
            >
              승인
            </Button>
          )}
        </strong>
      ),
      width: 200,
    },
    {
      field: 'approvalTime',
      flex: 1,
      headerName: '승인일자',
      width: 200,
    },
  ];

  const confirmApproval = async () => {
    await approveUser(approvalId);
    await mutate();
    toast.success('승인되었습니다.');
  };

  return (
    <DashboardContent className="dna-common-list">
      <CustomBreadcrumbs
        heading="사용자 관리"
        links={[{ name: '사용자 관리' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.manage.user.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            사용자 등록
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card className="list-filter" sx={{ mb: { xs: 3, md: 5 } }}>
        <UserFilter onSearch={(f) => setFilters(f)} />
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
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="승인"
        content={<>선택한 사용자를 승인하시겠습니까?</>}
        action={
          <Button
            variant="contained"
            color="primary"
            onClick={(c) => {
              confirmApproval().then((e) => {
                confirm.onFalse();
              });
            }}
          >
            승인
          </Button>
        }
      />
    </DashboardContent>
  );
}
