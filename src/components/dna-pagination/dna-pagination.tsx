import { Pagination } from '@mui/material';
import Stack from '@mui/material/Stack';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

// ----------------------------------------------------------------------

export type DnaPaginationProps = {
  totalCount: number;
  pagination: GridPaginationModel;
  setPagination: Dispatch<SetStateAction<GridPaginationModel>>;
};

export function DnaPagination({ totalCount, pagination, setPagination }: DnaPaginationProps) {
  const handleChange = (event: ChangeEvent<unknown>, value: number) => {
    setPagination({ ...pagination, page: value - 1 });
  };

  return (
    <Stack alignItems="center" width="100%">
      <Pagination
        sx={{ margin: 2 }}
        count={Math.trunc(totalCount / pagination.pageSize + 1)}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        page={pagination.page + 1}
        onChange={handleChange}
      />
    </Stack>
  );
}
