import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';

import { fDate } from '../../utils/format-time';
import { Iconify } from '../../components/iconify';
import { defaultApiLogFilters } from '../../types/api-log';
import { DnaSelectBox } from '../../components/form/dna-select-box';
import { DnaDateRangeBox } from '../../components/form/dna-date-range-box';
import { ServiceGroupSearchBox } from '../../components/dna-form/dna-service-group-search-box';

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

export function ApiLogFilter({ onSearch }: Props) {
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
    (field: string) => (e: any) => {
      setFilters({ ...filters, [field]: fDate(e, 'YYYY-MM-DD hh:mm:ss') });
    },
    [filters]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <DnaSelectBox
          label="결과"
          items={selectResult}
          value={filters.result}
          onValueChange={handleFilterName('result')}
          valueField="id"
          textField="text"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <ServiceGroupSearchBox onChange={handleFilter('serviceGroupId')} name="serviceGroupId" />
      </Grid>
      <Grid item xs={12} md={6}>
        <DnaDateRangeBox
          startValue={filters.fromTime}
          endValue={filters.toTime}
          onValueChange={handleFilterDate}
          startLabel="시작일시"
          endLabel="종료일시"
          startFieldName="fromTime"
          endFieldName="toTime"
          format="YYYY-MM-DD HH:mm:ss"
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
