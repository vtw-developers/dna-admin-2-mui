import type { ChangeEvent } from 'react';

import { useState, useEffect, useCallback } from 'react';

import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { getRoles } from '../../actions/user';
import { Iconify } from '../../components/iconify';
import { DnaSelectBox } from '../../components/form/dna-select-box';
import { type Role, type UserFilters, defaultUserFilters } from '../../types/user';
// ----------------------------------------------------------------------

type Props = {
  onSearch: (filters: UserFilters) => void;
};

export function UserFilter({ onSearch }: Props) {
  const [filters, setFilters] = useState<UserFilters>(defaultUserFilters);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    getRoles().then((e) => {
      setRoles([{ id: undefined, name: '[ 전체 ]' }, ...e]);
    });
  }, []);

  const handleFilterName = useCallback(
    (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setFilters({ ...filters, [field]: event.target.value });
    },
    [filters]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <TextField label="ID" value={filters.id} fullWidth onChange={handleFilterName('id')} />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          label="이름"
          value={filters.name}
          fullWidth
          onChange={handleFilterName('name')}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <DnaSelectBox
          label="역할"
          items={roles}
          value={filters.roleId}
          onValueChange={handleFilterName('roleId')}
          valueField="id"
          textField="name"
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
