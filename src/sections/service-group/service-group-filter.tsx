import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

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
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{ xs: 'column', md: 'row' }}
      sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
    >
      <TextField
        label="서비스그룹명"
        fullWidth
        value={filters.name}
        onChange={handleFilterName('name')}
      />
      <Button onClick={(e) => onSearch(filters)}>검색</Button>
    </Stack>
  );
}
