import { RHFSelect } from './rhf-select';
import { RHFSwitch } from './rhf-switch';
import { RHFEditor } from './rhf-editor';
import { RHFUpload } from './rhf-upload';
import { RHFTextField } from './rhf-text-field';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Switch: RHFSwitch,
  Select: RHFSelect,
  Editor: RHFEditor,
  Upload: RHFUpload,
};
