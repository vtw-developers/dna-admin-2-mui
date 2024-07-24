import type { PropsWithChildren } from 'react';

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
  <div className="dna-datetime-range-box">
    <DateTimePicker
      className="datetimebox"
      label={startLabel}
      defaultValue={startValue}
      onChange={onValueChange(startFieldName)}
      format={format}
      slotProps={{
        actionBar: {
          actions: ['clear', 'accept'],
        },
      }}
      readOnly={readonly}
    />
    ~
    <DateTimePicker
      className="datetimebox"
      label={endLabel}
      defaultValue={endValue}
      onChange={onValueChange(endFieldName)}
      format={format}
      slotProps={{
        actionBar: {
          actions: ['clear', 'accept'],
        },
      }}
      readOnly={readonly}
    />
  </div>
);
