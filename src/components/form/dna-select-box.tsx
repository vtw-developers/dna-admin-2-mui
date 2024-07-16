import type { PropsWithChildren } from 'react';

import MenuItem from '@mui/material/MenuItem';
import { Select, InputLabel, FormControl } from '@mui/material';

type SelectBoxProps = {
  value: any;
  onValueChange: any;
  items: any[];
  label: string;
  valueField: string;
  textField: string;
  readonly?: boolean;
};

export const DnaSelectBox = ({
  value,
  onValueChange,
  items,
  label,
  valueField,
  textField,
  readonly = false,
}: PropsWithChildren<SelectBoxProps>) => (
  <FormControl fullWidth>
    <InputLabel id="simple-select-label">{label}</InputLabel>
    <Select
      labelId="simple-select-label"
      label={label}
      value={value}
      onChange={onValueChange}
      readOnly={readonly}
    >
      {items.map((e, index) => (
        <MenuItem key={index} value={e[valueField]}>
          {e[textField]}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
