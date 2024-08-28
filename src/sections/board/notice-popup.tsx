import 'src/styles/list.scss';
import 'src/styles/form.scss';
import 'src/styles/global.scss';
import 'src/styles/dashboard.scss';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import { getCookie, setCookie } from 'src/utils/cookie';

import { useBoolean } from '../../hooks/use-boolean';
import { Scrollbar } from '../../components/scrollbar';

// ----------------------------------------------------------------------

export interface INoticePopup {
  id: number;
  visible: boolean;
  title: string;
  content: string;
}

type Props = {
  popup: INoticePopup;
};

export function NoticePopup({ popup }: Props) {
  const share = useBoolean(popup.visible);

  const onHide7days = (e: any) => {
    if (e.target.checked) {
      const arr: number[] = [];
      const cookies = getCookie('POPUP_EXPIRES');
      if (cookies != null) {
        arr.push(...JSON.parse(cookies));
      }
      arr.push(popup.id);
      setCookie('POPUP_EXPIRES', JSON.stringify(arr), 7);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={share.value}
      onClose={() => {
        share.onFalse();
      }}
    >
      <DialogTitle>{popup.title} </DialogTitle>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ px: 3 }}>
        <Scrollbar
          sx={{
            p: 3,
            height: '50vh',
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: popup.content }} />
        </Scrollbar>
      </Box>
      <Divider sx={{ my: 2 }} />
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <FormGroup>
          <FormControlLabel control={<Checkbox onChange={onHide7days} />} label="7일간 보지않기" />
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
