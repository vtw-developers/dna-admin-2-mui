import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fData } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../../iconify';
import { fileData } from '../../file-thumbnail';

import type { MultiFilePreviewProps } from '../types';

// ----------------------------------------------------------------------

export function MultiFilePreview({
  sx,
  onRemove,
  lastNode,
  thumbnail,
  slotProps,
  firstNode,
  files = [],
}: MultiFilePreviewProps) {
  const renderFirstNode = firstNode && <Box component="li">{firstNode}</Box>;

  const renderLastNode = lastNode && <Box component="li">{lastNode}</Box>;

  return (
    <Box
      component="ul"
      sx={{
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
    >
      {renderFirstNode}

      {files.map((file) => {
        const { name, size } = fileData(file);
        return (
          <Box
            component="li"
            key={file.id}
            sx={{
              py: 1,
              pr: 1,
              pl: 1.5,
              gap: 1.5,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }}
          >
            <ListItemText
              primary={name}
              secondary={fData(size)}
              secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
            />

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Box>
        );
      })}

      {renderLastNode}
    </Box>
  );
}
