import type { Dispatch, ChangeEvent, SetStateAction } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import Stack from '@mui/material/Stack';
import { Pagination } from '@mui/material';

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
        count={Math.ceil(totalCount / pagination.pageSize)}
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
