import type {
  GridRowId,
  GridColDef,
  GridRowModel,
  GridEventListener,
  GridRowModesModel,
} from '@mui/x-data-grid';

import { z as zod } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useMemo, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { Select } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridRowModes, GridRowEditStopReasons } from '@mui/x-data-grid';

import { Iconify } from '../../components/iconify';

const yaml = require('js-yaml');

// ----------------------------------------------------------------------
const types = ['String', 'Integer', 'Number', 'Object', 'Array', 'Boolean'];

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.number().optional(),
  name: zod
    .string()
    .min(1, { message: '게시판 이름를 입력하세요.' })
    .max(50, { message: '50자 이내로 입력하세요.' }),
  httpMethod: zod.string().min(1, { message: 'HTTP Method 를 입력하세요.' }),
  url: zod.string().min(1, { message: 'URL을 입력하세요.' }),
  serviceGroupId: zod.number(),
  enabled: zod.boolean(),
  flowId: zod.string(),
  flowMetaYaml: zod.string(),
  requestParameters: zod.any().array(),
  responseElements: zod.any().array(),
});

// ----------------------------------------------------------------------

type Props = {
  title: string;
  editing: boolean;
  initialRows: any[];
  importedRows?: any;
  onChange: (rows: any[]) => void;
};

export function ParametersEditGrid({ title, editing, initialRows, importedRows, onChange }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  console.log(initialRows);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    importedRows &&
      setRows(
        importedRows.map((row) => {
          row.id = uuidv4();
          return row;
        })
      );
  }, [importedRows]);

  useEffect(() => {
    console.log('rows');
    onChange(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const columnVisibilityModel = useMemo(() => {
    if (editing) {
      return {
        name: true,
        type: true,
        actions: true,
      };
    }
    return {
      name: true,
      type: true,
      actions: false,
    };
  }, [editing]);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: '이름',
      minWidth: 300,
      editable: editing,
    },
    {
      field: 'type',
      headerName: '유형',
      flex: 1,
      renderCell: (params) => {
        const isInEditMode = rowModesModel[params.row.id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return (
            <Select
              value={params.row.type}
              onChange={handleRow('type', params.row.id)}
              readOnly={!editing}
              variant="standard"
              sx={{ width: '100%', border: 'none' }}
            >
              {types.map((e, index) => (
                <MenuItem key={index} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          );
        }
        return <>{params.row.type}</>;
      },
    },
    {
      field: 'description',
      headerName: '설명',
      flex: 1,
      editable: editing,
    },
    {
      field: 'defaultValue',
      headerName: '기본값',
      flex: 1,
      editable: editing,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      renderCell: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return (
            <>
              <IconButton onClick={handleSaveClick(id)}>
                <Iconify icon="mingcute:save-2-line" />
              </IconButton>
              <IconButton onClick={handleCancelClick(id)}>
                <Iconify icon="mingcute:close-line" />
              </IconButton>
            </>
          );
        }

        return (
          <>
            <IconButton onClick={handleEditClick(id)}>
              <Iconify icon="mingcute:edit-line" />
            </IconButton>
            <IconButton onClick={handleDeleteClick(id)}>
              <Iconify icon="mingcute:delete-2-line" />
            </IconButton>
          </>
        );
      },
    },
  ];
  const handleRow = (field: string, id: string) => (event: any) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: event.target.value };
        }
        return row;
      })
    );
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleClick = () => {
    const id = uuidv4();
    setRows((oldRows) => [...oldRows, { id, name: '', type: 'String', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <Card>
      <CardHeader title={title} subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        {editing && (
          <Button
            color="primary"
            variant="outlined"
            onClick={handleClick}
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ width: '100px' }}
          >
            추가
          </Button>
        )}
        <DataGrid
          columns={columns}
          rows={rows}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          columnVisibilityModel={columnVisibilityModel}
          hideFooterPagination
          disableColumnSorting
          autoHeight
          localeText={{ noRowsLabel: '데이터 없음' }}
          slotProps={
            editing
              ? {
                  toolbar: { setRows, setRowModesModel },
                }
              : {}
          }
        />
      </Stack>
    </Card>
  );
}
