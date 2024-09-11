import type { ChangeEvent } from 'react';

import { useState, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Iconify } from '../../components/iconify';
import { selectEnabled } from '../api-info/api-info-filter';
import { defaultCtiInfoFilters } from '../../types/cti-info';
import { DnaSelectBox } from '../../components/form/dna-select-box';
import { ServiceGroupSearchBox } from '../../components/dna-form/dna-service-group-search-box';

import type { CtiInfoFilters } from '../../types/cti-info';

// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: CtiInfoFilters) => void;
};

const selectMethod = [
  { id: undefined, text: '[ 전체 ]' },
  { id: '1', text: '전체 삭제 후 적재' },
  { id: '2', text: 'DB트리거 변경적재' },
  { id: '3', text: '수정일시기준 변경적재' },
];

export function CtiInfoFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<CtiInfoFilters>(defaultCtiInfoFilters);

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <TextField
          label="CTI명"
          fullWidth
          value={filters.name}
          onChange={handleFilterName('name')}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <DnaSelectBox
          label="사용여부"
          items={selectEnabled}
          value={filters.enabled}
          onValueChange={handleFilterName('enabled')}
          valueField="id"
          textField="text"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <DnaSelectBox
          label="처리방식"
          items={selectMethod}
          value={filters.httpMethod}
          onValueChange={handleFilterName('httpMethod')}
          valueField="id"
          textField="text"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <ServiceGroupSearchBox name="serviceGroupId" onChange={handleFilter('httpMethod')} />
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
