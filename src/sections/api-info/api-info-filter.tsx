import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import type { ApiInfoFilters } from '../../types/api-info';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: ApiInfoFilters) => void;
};

export function ApiInfoFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<ApiInfoFilters>({ name: '', httpMethod: '' });

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, [field]: event.target.value });
    },
    [filters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <TextField label="API명" fullWidth value={filters.name} onChange={handleFilterName('name')} />
      <TextField
        label="HTTP Method"
        fullWidth
        value={filters.httpMethod}
        onChange={handleFilterName('httpMethod')}
      />
      <Button onClick={(e) => onSearch(filters)}>검색</Button>
    </Stack>
  );
}
