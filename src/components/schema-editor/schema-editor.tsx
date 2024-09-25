import type { ChangeEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material';

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Select, styled, FormControl } from '@mui/material';

import { exportFlow, importFlow } from 'src/actions/templated-flow';

import type { DataSchema } from '../../types/templated-flow';

const NAME_WIDTH = 340;

type Props = {
  initialData: any;
  onChange: (data: DataSchema) => void;
};

export const SchemaEditor = ({ initialData, onChange }: Props) => {
  console.log(initialData);
  const [data, setData] = useState(initialData);

  useEffect(() => {
    console.log(data);
    onChange(data);
  }, [data, onChange]);

  const onChangeName = (event: ChangeEvent<HTMLInputElement>, row: DataSchema) => {
    console.log(data);
    row.name = event.target.value;
    setData({ ...data });
  };

  const onChangeType = (event: SelectChangeEvent<HTMLInputElement>, row: DataSchema) => {
    console.log(data);
    row.type = event.target.value as string;
    if (event.target.value !== 'Object') {
      row.children = [];
    }
    setData({ ...data });
  };

  const onChangeDescription = (event: ChangeEvent<HTMLInputElement>, row: DataSchema) => {
    console.log(data);
    row.description = event.target.value;
    setData({ ...data });
  };

  const onChangeArrayType = (event: SelectChangeEvent<HTMLInputElement>, row: DataSchema) => {
    console.log(data);
    row.arrayType = event.target.value as string;
    if (event.target.value !== 'Object') {
      row.children = [];
    }
    setData({ ...data });
  };

  const addRow = (row: DataSchema) => {
    row.children.push({
      id: uuidv4(),
      name: '',
      type: 'String',
      children: [],
      depth: row.depth + 1,
      arrayType: undefined,
      description: '',
    });
    setData({ ...data });
  };

  const removeRow = (row: DataSchema) => {
    setData({ ...data, children: removeNodeById(data.children, row.id) });
  };

  const removeNodeById = (nodeArray: DataSchema[], id: string) =>
    nodeArray.filter((node) => {
      if (node.id === id) {
        return false;
      }
      if (node.children) {
        node.children = removeNodeById(node.children, id);
      }
      return true;
    });

  const arrayTypeSelectBox = (row: any) => (
    <FormControl style={{ width: 200 }}>
      <Select
        value={row.arrayType}
        size="small"
        displayEmpty
        onChange={(e: SelectChangeEvent<HTMLInputElement>) => onChangeArrayType(e, row)}
        variant="outlined"
      >
        <MenuItem value="String">String</MenuItem>
        <MenuItem value="Integer">Integer</MenuItem>
        <MenuItem value="Object">Object</MenuItem>
        <MenuItem value="Array">Array</MenuItem>
      </Select>
    </FormControl>
  );

  const addButton = (parent: DataSchema) => <Button onClick={() => addRow(parent)}>추가</Button>;
  const deleteButton = (row: DataSchema) => <Button onClick={() => removeRow(row)}>삭제</Button>;

  const nameInput = (row: DataSchema) => (
    <TextField
      value={row.name || ''}
      size="small"
      style={{ width: NAME_WIDTH - row.depth * 24 }}
      placeholder="필드명"
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeName(e, row)}
    />
  );

  const descriptionInput = (row: DataSchema) => (
    <TextField
      value={row.description || ''}
      size="small"
      style={{ width: 300 }}
      placeholder="설명"
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeDescription(e, row)}
    />
  );

  const typeInput = (row: any) => (
    <FormControl style={{ width: 200 }}>
      <Select
        value={row.type}
        size="small"
        variant="outlined"
        displayEmpty
        onChange={(e: SelectChangeEvent<HTMLInputElement>) => onChangeType(e, row)}
      >
        <MenuItem value="String">String</MenuItem>
        <MenuItem value="Integer">Integer</MenuItem>
        <MenuItem value="Object">Object</MenuItem>
        <MenuItem value="Array">Array</MenuItem>
      </Select>
    </FormControl>
  );

  const recursive = (row: any) => (
    <>
      {row.children.map((child: DataSchema, i: number) => (
        <div key={i}>
          <Stack direction="row" spacing={2} sx={{ px: 3 * child.depth, pt: 1 }}>
            {nameInput(child)}
            {typeInput(child)}
            {child.type === 'Array' && arrayTypeSelectBox(child)}
            {descriptionInput(child)}
            {(child.type === 'Object' ||
              (child.type === 'Array' && child.arrayType === 'Object')) &&
              addButton(child)}
            {deleteButton(child)}
          </Stack>
          {recursive(child)}
        </div>
      ))}
    </>
  );

  const importSchema = (e: any) => {
    const { files } = e.target;
    if (files.length < 1) {
      return;
    }
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = async (f) => {
      console.log(f);
      const schemaYaml = f.target?.result as string;
      console.log(schemaYaml);
      await importFlow({ yaml: schemaYaml }).then((result) => {
        console.log(result);
        setData(result);
      });
    };
    fileReader.readAsText(file);
  };

  const exportSchema = async () => {
    const { yaml } = await exportFlow(data);
    const element = document.createElement('a');
    const file = new Blob([yaml], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'api.rest.yaml';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <div>
      <div>
        <Stack direction="row" spacing={2} sx={{ px: 3, pt: 1 }}>
          <Button variant="outlined" component="label">
            가져오기
            <VisuallyHiddenInput type="file" onChange={importSchema} />
          </Button>
          <Button variant="outlined" onClick={exportSchema}>
            내보내기
          </Button>
        </Stack>
      </div>
      <div>
        <Stack direction="row" spacing={2} sx={{ px: 3, pt: 1 }}>
          {nameInput(data)}
          {typeInput(data)}
          {data.type === 'Object' && addButton(data)}
        </Stack>
        {recursive(data)}
      </div>
    </div>
  );
};
