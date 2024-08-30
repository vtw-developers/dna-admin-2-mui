import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';

import { fDate } from '../../utils/format-time';
import { Iconify } from '../../components/iconify';
import { defaultApiStatsFilters } from '../../types/api-stats';
import { DnaDateRangeBox } from '../../components/form/dna-date-range-box';

import type { ApiStatsFilters } from '../../types/api-stats';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: ApiStatsFilters) => void;
};

export function ApiStatsFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<ApiStatsFilters>(defaultApiStatsFilters);

  const handleFilterDate = useCallback(
    (field: string, format: string) => (e: any) => {
      setFilters({ ...filters, [field]: fDate(e, format) });
    },
    [filters]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <DnaDateRangeBox
          startValue={filters.startDate}
          endValue={filters.endDate}
          onValueChange={handleFilterDate}
          startLabel="시작일시"
          endLabel="종료일시"
          startFieldName="startDate"
          endFieldName="endDate"
          format="YYYY-MM-DD"
        />
      </Grid>
      <Grid item xs={12} md={12} textAlign="center">
        <Button
          onClick={() => onSearch(filters)}
          variant="outlined"
          startIcon={<Iconify icon="mingcute:search-line" />}
        >
          검색
        </Button>
      </Grid>
    </Grid>
  );
}
