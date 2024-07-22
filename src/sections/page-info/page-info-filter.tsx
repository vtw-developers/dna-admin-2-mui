import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Iconify } from '../../components/iconify';
import { defaultPageInfoFilters } from '../../types/page-info';

import type { PageInfoFilters } from '../../types/page-info';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: PageInfoFilters) => void;
};

export function PageInfoFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<PageInfoFilters>(defaultPageInfoFilters);

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
          label="페이지명"
          value={filters.name}
          fullWidth
          onChange={handleFilterName('name')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="경로"
          value={filters.path}
          fullWidth
          onChange={handleFilterName('path')}
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
