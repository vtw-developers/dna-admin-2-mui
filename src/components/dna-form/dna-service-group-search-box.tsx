import { useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { Iconify } from '../iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { ServiceGroupSelectionPopup } from '../popup/selection/service-group-selection-popup';

type Props = { label?: string; onChange: any };

export const ServiceGroupSearchBox = ({ label, onChange }: Props) => {
  const confirm = useBoolean();

  const [serviceGroup, setServiceGroup] = useState({ id: undefined, name: '' });

  const onChangeServiceGroup = (group: any) => {
    setServiceGroup(group);
    onChange(group.id);
  };

  return (
    <>
      <TextField
        label={label}
        sx={{ width: '100%' }}
        placeholder="서비스 그룹"
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
        onChange={onChangeServiceGroup}
        open={confirm.value}
        onClose={confirm.onFalse}
      />
    </>
  );
};
