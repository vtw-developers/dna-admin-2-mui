import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Iconify } from '../../components/iconify';
import { defaultServiceGroupFilters } from '../../types/service-group';

import type { ServiceGroupFilters } from '../../types/service-group';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: ServiceGroupFilters) => void;
};

export function ServiceGroupFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<ServiceGroupFilters>(defaultServiceGroupFilters);

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
          label="서비스그룹명"
          fullWidth
          value={filters.name}
          onChange={handleFilterName('name')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="서비스그룹명"
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
