import { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Iconify } from '../iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { ServiceGroupSelectionPopup } from '../popup/selection/service-group-selection-popup';

type Props = { value: any; onChange: any };

export const ServiceGroupSearchBox = ({ value, onChange }: Props) => {
  const confirm = useBoolean();

  const [serviceGroup, setServiceGroup] = useState({ id: undefined, name: '' });

  const onChangeObject = (sg) => {
    setServiceGroup(sg);
    onChange(sg.id);
  };

  return (
    <>
      <TextField
        label="서비스 그룹"
        sx={{ width: '100%' }}
        value={serviceGroup?.name}
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
      <ServiceGroupSelectionPopup
        selectedItem={value}
        onChange={onChangeObject}
        open={confirm.value}
        onClose={confirm.onFalse}
      />
    </>
  );
};
