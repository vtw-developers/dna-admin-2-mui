import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Iconify } from '../../components/iconify';
import { defaultBoardMasterFilters } from '../../types/board-master';

import type { BoardMasterFilters } from '../../types/board-master';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: BoardMasterFilters) => void;
};

export function BoardMasterFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<BoardMasterFilters>(defaultBoardMasterFilters);

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, [field]: event.target.value });
    },
    [filters]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <TextField
          label="게시판명"
          value={filters.name}
          fullWidth
          onChange={handleFilterName('name')}
        />
      </Grid>
      <Grid item xs={12} md={12} textAlign="center">
        <Button
          onClick={(e) => onSearch(filters)}
          variant="outlined"
          startIcon={<Iconify icon="mingcute:search-line" />}
        >
          검색
        </Button>
      </Grid>
    </Grid>
  );
}
