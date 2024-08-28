import type {
  GridSlots,
  GridRowId,
  GridColDef,
  GridRowsProp,
  GridRowModel,
  GridRowModesModel,
  GridEventListener,
} from '@mui/x-data-grid';

import { z as zod } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useMemo, useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import {
  DataGrid,
  GridRowModes,
  GridToolbarContainer,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

const yaml = require('js-yaml');

// ----------------------------------------------------------------------

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

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}

// ----------------------------------------------------------------------

type Props = {
  title: string;
  editing: boolean;
  initialRows: any[];
  onChange: (rows) => void;
};

export function ParametersEditGrid({ title, editing, initialRows, onChange }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  useEffect(() => {
    onChange(rows);
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
      editable: true,
    },
    {
      field: 'type',
      headerName: '유형',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      renderCell: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        console.log(isInEditMode);
        if (isInEditMode) {
          return (
            <>
              <Button onClick={handleSaveClick(id)}>Save</Button>
              <Button onClick={handleCancelClick(id)}>Cancel</Button>
            </>
          );
        }

        return (
          <>
            <Button onClick={handleEditClick(id)}>Edit</Button>
            <Button onClick={handleDeleteClick(id)}>Delete</Button>
          </>
        );
      },
    },
  ];

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

  function EditToolbar(props: EditToolbarProps) {
    const { setRows, setRowModesModel } = props;

    const handleClick = () => {
      const id = uuidv4();
      setRows((oldRows) => [...oldRows, { id, name: '', type: 'String', isNew: true }]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    };

    return (
      <GridToolbarContainer>
        <Button color="primary" onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <Card>
      <CardHeader title={title} subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <DataGrid
          /*          getRowId={(row) => row.name} */
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
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar'],
          }}
          slotProps={{
            toolbar: { setRows, setRowModesModel },
          }}
        />
      </Stack>
    </Card>
  );
}
