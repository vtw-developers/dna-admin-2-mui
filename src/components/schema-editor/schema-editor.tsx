import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Select, FormControl } from '@mui/material';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  onChange: any;
};

const NAME_WIDTH = 300;

export const SchemaEditor = () => {
  const [data, setData] = useState({
    name: 'root',
    type: 'Object',
    depth: 1,
    children: [
      {
        name: '1',
        type: 'String',
        depth: 2,
        children: [],
      },
      {
        name: '2',
        type: 'String',
        depth: 2,
        children: [],
      },
    ],
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>, row) => {
    console.log(data);
    row.name = event.target.value;
    setData({ ...data });
  };

  const onChangeType = (event: React.ChangeEvent<HTMLInputElement>, row) => {
    console.log(data);
    row.type = event.target.value;
    if (event.target.value !== 'Object') {
      row.children = [];
    }
    setData({ ...data });
  };

  const onChangeArrayType = (event: React.ChangeEvent<HTMLInputElement>, row) => {
    console.log(data);
    row.arrayType = event.target.value;
    if (event.target.value !== 'Object') {
      row.children = [];
    }
    setData({ ...data });
  };

  const addRow = (row) => {
    row.children.push({ name: 'test', children: [], depth: row.depth + 1 });
    setData({ ...data });
  };

  const recursive = (row) => (
    <>
      {row.children.map((child) => (
        <>
          <Stack direction="row" spacing={2} sx={{ px: 3 * child.depth, pt: 1 }}>
            <TextField
              value={child.name}
              size="small"
              style={{ width: NAME_WIDTH - child.depth * 24 }}
              onChange={(e) => onChange(e, child)}
            />
            <FormControl style={{ width: 200 }}>
              <Select
                defaultValue="String"
                size="small"
                displayEmpty
                onChange={(e) => onChangeType(e, child)}
              >
                <MenuItem value="String">String</MenuItem>
                <MenuItem value="Integer">Integer</MenuItem>
                <MenuItem value="Object">Object</MenuItem>
                <MenuItem value="Array">Array</MenuItem>
              </Select>
            </FormControl>
            {child.type === 'Array' && (
              <FormControl style={{ width: 200 }}>
                <Select
                  defaultValue="String"
                  size="small"
                  displayEmpty
                  onChange={(e) => onChangeArrayType(e, child)}
                >
                  <MenuItem value="String">String</MenuItem>
                  <MenuItem value="Integer">Integer</MenuItem>
                  <MenuItem value="Object">Object</MenuItem>
                </Select>
              </FormControl>
            )}
            {(child.type === 'Object' ||
              (child.type === 'Array' && child.arrayType === 'Object')) && (
              <Button onClick={() => addRow(child)}>추가</Button>
            )}
          </Stack>
          {recursive(child)}
        </>
      ))}
    </>
  );

  return (
    <div>
      <Stack direction="row" spacing={2} sx={{ px: 3, pt: 1 }}>
        <TextField
          value={data.name}
          size="small"
          style={{ width: NAME_WIDTH - 24 }}
          onChange={(e) => onChange(e, data)}
          disabled
        />
        <FormControl style={{ width: 200 }}>
          {/* <InputLabel id="demo-simple-select-label">Type</InputLabel> */}
          <Select
            defaultValue="String"
            size="small"
            displayEmpty
            onChange={(e) => onChangeType(e, data)}
          >
            <MenuItem value="String">String</MenuItem>
            <MenuItem value="Integer">Integer</MenuItem>
            <MenuItem value="Object">Object</MenuItem>
            <MenuItem value="Array">Array</MenuItem>
          </Select>
        </FormControl>
        {data.type === 'Object' && <Button onClick={() => addRow(data)}>추가</Button>}
      </Stack>
      {recursive(data)}
    </div>
  );
};
