import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useState, useEffect, useCallback, type ChangeEvent } from 'react';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DataGrid, gridClasses, type GridColDef } from '@mui/x-data-grid';

import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';
import { EmptyContent } from '../../empty-content';
import { DnaPagination } from '../../dna-pagination';
import { defaultPagination } from '../../../utils/pagination';
import { useGetServiceGroups } from '../../../actions/service-group';
import { defaultServiceGroupFilters } from '../../../types/service-group';
import { ServiceGroupFilter } from '../../../sections/service-group/service-group-filter';

import type { ServiceGroup, ServiceGroupFilters } from '../../../types/service-group';

type DialogProps = {
  open: boolean;
  onClose: () => void;
};

export const ServiceGroupSelectionPopup = ({ open, onClose }: DialogProps) => {
  const router = useRouter();
  const [tableData, setTableData] = useState<ServiceGroup[]>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<ServiceGroupFilters>(defaultServiceGroupFilters);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { data, loading, totalCount } = useGetServiceGroups(pagination, sortModel, filters);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination, filters]);

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.manage.serviceGroup.details(id));
    },
    [router]
  );

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, [field]: event.target.value });
    },
    [filters]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: '서비스그룹명',
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
  ];
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 2 }}>서비스 그룹</DialogTitle>

      <DialogContent
        sx={{ typography: 'body2', minHeight: '50vh', display: 'flex', flexDirection: 'column' }}
      >
        <Card className="list-filter" sx={{ mt: 2, mb: { xs: 3, md: 5 }, p: 3 }}>
          <ServiceGroupFilter onSearch={(f) => setFilters(f)} />
        </Card>
        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
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
            sx={{
              [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
            }}
          />
        </Card>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          확인
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
};
