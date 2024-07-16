import type { PropsWithChildren } from 'react';

import { FormControl } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

type DateRangeBoxProps = {
  startValue: any;
  endValue: any;
  onValueChange: any;
  startFieldName: string;
  endFieldName: string;
  format: string;
  startLabel: string;
  endLabel: string;
  readonly?: boolean;
};

export const DnaDateRangeBox = ({
  startValue,
  endValue,
  onValueChange,
  startLabel,
  endLabel,
  startFieldName,
  endFieldName,
  format,
  readonly = false,
}: PropsWithChildren<DateRangeBoxProps>) => (
  <FormControl fullWidth>
    <DateTimePicker
      label={startLabel}
      value={startValue}
      onChange={onValueChange(startFieldName)}
      format={format}
    />
    ~
    <DateTimePicker
      label={endLabel}
      value={endValue}
      onChange={onValueChange(endFieldName)}
      format={format}
    />
  </FormControl>
);
