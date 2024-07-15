import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Iconify } from '../../components/iconify';
import { defaultCtiInfoFilters } from '../../types/cti-info';

import type { CtiInfoFilters } from '../../types/cti-info';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: CtiInfoFilters) => void;
};

export function CtiInfoFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<CtiInfoFilters>(defaultCtiInfoFilters);

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, [field]: event.target.value });
    },
    [filters]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          label="CTI명"
          fullWidth
          value={filters.name}
          onChange={handleFilterName('name')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="CTI명"
          fullWidth
          value={filters.name}
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
