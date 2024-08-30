import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';

import { fDate } from '../../utils/format-time';
import { Iconify } from '../../components/iconify';
import { defaultApiLogFilters } from '../../types/api-log';
import { DnaDateRangeBox } from '../../components/form/dna-date-range-box';

import type { ApiLogFilters } from '../../types/api-log';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: ApiLogFilters) => void;
};

const selectResult = [
  { id: undefined, text: '[ 전체 ]' },
  { id: 'ERROR', text: '오류' },
  { id: 'SUCCESS', text: '성공' },
];

export const selectEnabled = [
  { id: undefined, text: '[ 전체 ]' },
  { id: true, text: '사용' },
  { id: false, text: '미사용' },
];

export function ApiStatsFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<ApiLogFilters>(defaultApiLogFilters);

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, [field]: event.target.value });
    },
    [filters]
  );

  const handleFilter = useCallback(
    (field: string) => (e: any) => {
      setFilters({ ...filters, [field]: e });
    },
    [filters]
  );

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
