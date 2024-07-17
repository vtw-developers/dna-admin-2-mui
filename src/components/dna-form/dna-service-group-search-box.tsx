import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Iconify } from '../iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { ServiceGroupSelectionPopup } from '../popup/selection/service-group-selection-popup';

type Props = {};

export const ServiceGroupSearchBox = ({}: Props) => {
  // const [popupVisible, setPopupVisible] = useState(false)
  const confirm = useBoolean();
  return (
    <>
      <TextField
        label="서비스 그룹"
        sx={{ width: '100%' }}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <Button
              className="service-group-search-button"
              variant="text"
              onClick={confirm.onTrue}
              startIcon={<Iconify icon="mingcute:search-2-line" sx={{ minWidth: '20px' }} />}
            />
          ),
        }}
      />
      <ServiceGroupSelectionPopup open={confirm.value} onClose={confirm.onFalse} />
    </>
  );
};
