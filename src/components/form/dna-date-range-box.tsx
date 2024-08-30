import type { PropsWithChildren } from 'react';

import dayjs from 'dayjs';

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
      defaultValue={startValue === undefined ? undefined : dayjs(startValue)}
      onChange={onValueChange(startFieldName, format)}
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
      defaultValue={endValue === undefined ? undefined : dayjs(endValue)}
      onChange={onValueChange(endFieldName, format)}
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
