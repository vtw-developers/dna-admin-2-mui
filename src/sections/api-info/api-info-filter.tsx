import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Iconify } from '../../components/iconify';
import { defaultApiInfoFilters } from '../../types/api-info';

import type { ApiInfoFilters } from '../../types/api-info';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: ApiInfoFilters) => void;
};

export function ApiInfoFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<ApiInfoFilters>(defaultApiInfoFilters);

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
          label="API명"
          fullWidth
          value={filters.name}
          onChange={handleFilterName('name')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="HTTP Method"
          fullWidth
          value={filters.httpMethod}
          onChange={handleFilterName('httpMethod')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="HTTP Method"
          fullWidth
          value={filters.httpMethod}
          onChange={handleFilterName('httpMethod')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="HTTP Method"
          fullWidth
          value={filters.httpMethod}
          onChange={handleFilterName('httpMethod')}
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
