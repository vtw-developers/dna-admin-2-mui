import 'src/styles/list.scss';
import 'src/styles/form.scss';
import 'src/styles/global.scss';
import 'src/styles/dashboard.scss';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useBoolean } from '../../hooks/use-boolean';

// ----------------------------------------------------------------------

export function NoticePopup({ popup }) {
  const share = useBoolean(true);

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={share.value}
      onClose={() => {
        share.onFalse();
      }}
    >
      <DialogTitle>{popup.title} </DialogTitle>
      <Box sx={{ px: 3 }}>
        <div dangerouslySetInnerHTML={{ __html: popup.content }} />
      </Box>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <FormGroup>
          <FormControlLabel control={<Checkbox defaultChecked />} label="7일간 보지않기" />
        </FormGroup>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => {
            share.onFalse();
          }}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
