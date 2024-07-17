import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from '../iconify';

import type { UseBooleanReturn } from '../../hooks/use-boolean';

type ButtonsProps = {
  editing: boolean;
  listPath: string;
  editPath: string;
  confirm: UseBooleanReturn;
  isSubmitting: boolean;
  cancelEdit: () => void;
};
export const DnaBottomButtons = ({
  editing,
  listPath,
  editPath,
  confirm,
  isSubmitting,
  cancelEdit,
}: ButtonsProps) => (
  <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap" justifyContent="center">
    {!editing && (
      <Button
        variant="outlined"
        size="medium"
        color="primary"
        href={editPath}
        startIcon={<Iconify icon="mingcute:edit-line" />}
      >
        수정
      </Button>
    )}
    {!editing && (
      <Button
        variant="outlined"
        size="medium"
        color="error"
        onClick={confirm.onTrue}
        startIcon={<Iconify icon="mingcute:delete-2-line" />}
      >
        삭제
      </Button>
    )}
    {editing && (
      <LoadingButton
        type="submit"
        variant="outlined"
        size="medium"
        color="primary"
        loading={isSubmitting}
        startIcon={<Iconify icon="mingcute:save-2-line" />}
      >
        저장
      </LoadingButton>
    )}
    {editing && (
      <LoadingButton
        onClick={cancelEdit}
        variant="outlined"
        size="medium"
        color="error"
        loading={isSubmitting}
        startIcon={<Iconify icon="mingcute:close-line" />}
      >
        취소
      </LoadingButton>
    )}
    <Button
      variant="outlined"
      size="medium"
      color="inherit"
      href={listPath}
      startIcon={<Iconify icon="mingcute:list-check-line" />}
    >
      목록
    </Button>
  </Stack>
);
