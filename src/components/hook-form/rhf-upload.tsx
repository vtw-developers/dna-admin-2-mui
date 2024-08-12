import { Controller, useFormContext } from 'react-hook-form';

import { Upload } from '../upload/upload';

import type { UploadProps } from '../upload/types';

// ----------------------------------------------------------------------

type Props = UploadProps & {
  name: string;
};

export function RHFUpload({ name, multiple, helperText, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const uploadProps = {
          multiple,
          accept: { '*': [] },
          error: !!error,
          helperText: error?.message ?? helperText,
        };

        const onDrop = (acceptedFiles: File[]) => {
          const value = multiple ? [...field.value, ...acceptedFiles] : acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return <Upload {...uploadProps} value={field.value} onDrop={onDrop} {...other} />;
      }}
    />
  );
}
