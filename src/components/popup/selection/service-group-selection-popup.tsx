import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridRowId, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

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
  onChange: any;
};

export const ServiceGroupSelectionPopup = ({ open, onClose, onChange }: DialogProps) => {
  const [tableData, setTableData] = useState<ServiceGroup[]>([]);
  const [pagination, setPagination] = useState<GridPaginationModel>(defaultPagination);
  const [filters, setFilters] = useState<ServiceGroupFilters>(defaultServiceGroupFilters);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { data, loading, totalCount } = useGetServiceGroups(pagination, sortModel, filters);
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  useEffect(() => {
    setTableData(data);
  }, [data, sortModel, pagination, filters]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: '서비스그룹명',
      width: 300,
    },
  ];

  const selectItem = () => {
    if (selectionModel.length > 0) {
      const select = tableData.find((e: ServiceGroup) => e.id === selectionModel[0]);
      onChange(select);
      onClose();
    }
  };

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
            rows={tableData}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10, 25]}
            sortingMode="server"
            paginationMode="server"
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(e: GridRowSelectionModel) => {
              setSelectionModel(e);
            }}
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
            keepNonExistentRowsSelected
          />
        </Card>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={selectItem}>
          확인
        </Button>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
};
