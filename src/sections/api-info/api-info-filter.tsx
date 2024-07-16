import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { fDate } from '../../utils/format-time';
import { Iconify } from '../../components/iconify';
import { defaultApiInfoFilters } from '../../types/api-info';
import { DnaSelectBox } from '../../components/form/dna-select-box';
import { DnaDateRangeBox } from '../../components/form/dna-date-range-box';

import type { ApiInfoFilters } from '../../types/api-info';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: ApiInfoFilters) => void;
};

const selectMethod = [
  { id: undefined, text: '[ 전체 ]' },
  { id: 'get', text: 'GET' },
  { id: 'post', text: 'POST' },
];

const selectEnabled = [
  { id: undefined, text: '[ 전체 ]' },
  { id: true, text: '사용' },
  { id: false, text: '미사용' },
];

export function ApiInfoFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<ApiInfoFilters>(defaultApiInfoFilters);

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, [field]: event.target.value });
    },
    [filters]
  );
  const handleFilterDate = useCallback(
    (field: string) => (e: any) => {
      console.log(field);
      console.log(fDate(e, 'YYYY-MM-DD HH:mm:ss'));
      setFilters({ ...filters, [field]: e });
      console.log(filters);
    },
    [filters]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField
          label="API명"
          fullWidth
          value={filters.name}
          onChange={handleFilterName('name')}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <DnaSelectBox
          label="HTTP Method"
          items={selectMethod}
          value={filters.httpMethod}
          onValueChange={handleFilterName('httpMethod')}
          valueField="id"
          textField="text"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <DnaSelectBox
          label="Enabled"
          items={selectEnabled}
          value={filters.enabled}
          onValueChange={handleFilterName('enabled')}
          valueField="id"
          textField="text"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <DnaDateRangeBox
          startValue={filters.startModifiedTime}
          endValue={filters.endModifiedTime}
          onValueChange={handleFilterDate}
          startLabel="start"
          endLabel="end"
          startFieldName="startModifiedTime"
          endFieldName="endModifiedTime"
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
