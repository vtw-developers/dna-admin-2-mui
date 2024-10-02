import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { databases } from './datasource-edit-form';
import { Iconify } from '../../components/iconify';
import { defaultDatasourceFilters } from '../../types/datasource';
import { DnaSelectBox } from '../../components/form/dna-select-box';

import type { DatasourceFilters } from '../../types/datasource';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: DatasourceFilters) => void;
};

export function DatasourceFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<DatasourceFilters>(defaultDatasourceFilters);

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
          label="데이터소스명"
          fullWidth
          value={filters.name}
          onChange={handleFilterName('name')}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DnaSelectBox
          label="데이터베이스"
          items={databases}
          value={filters.database}
          onValueChange={handleFilterName('database')}
          valueField="id"
          textField="id"
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
