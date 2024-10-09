import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';

import { getDatasources } from '../../actions/datasource';

import type { EditorProps } from '../editor';
import type { FlowTemplate } from '../../types/flow-template';

// ----------------------------------------------------------------------

type Props = EditorProps & {
  name: string;
  editing: boolean;
  parameters?: any;
  currentTemplate?: FlowTemplate;
  setValue?: any;
};

export function RHFParametersEditor({ name, editing, currentTemplate, setValue }: Props) {
  const {
    control,
    formState: { isSubmitSuccessful },
    getValues,
  } = useFormContext();

  const [dataSources, setDataSources] = useState([]);
  useEffect(() => {
    getDatasources().then((data) => setDataSources(data));
  }, []);

  const parameters = getValues(name);

  const onTemplateParameterChanged = (param, value, field) => {
    console.log(param);
    console.log(parameters);

    if (!parameters.find((f: any) => f.name === param.name)) {
      parameters.push({ name: param.name, value });
    }
    const params = parameters.map((v: any) => {
      console.log(v);
      console.log(param);
      if (v.name === param.name) {
        v.value = value;
      }
      return v;
    });

    console.log(params);
    field.onChange([...params]);
    // @ts-ignore
    // setValue('parameters', [...params]);
  };

  const onDataSourceChanged = (param, value, field) => {
    console.log(param);
    console.log(parameters);
    console.log(value);

    if (!parameters.find((f: any) => f.name === param.name)) {
      parameters.push({
        name: param.name,
        value: { dataSource: value, sql: 'SELECT * FROM TABLE' },
      });
    }
    const params = parameters.map((v: any) => {
      console.log(v);
      console.log(param);
      if (v.name === param.name) {
        v.value = { ...v.value, dataSource: value };
      }
      return v;
    });

    console.log(params);
    field.onChange([...params]);
  };

  const onSqlChanged = (param, value, field) => {
    console.log(param);
    console.log(parameters);
    console.log(value);

    if (!parameters.find((f: any) => f.name === param.name)) {
      parameters.push({
        name: param.name,
        value: { dataSource: undefined, sql: value },
      });
    }
    const params = parameters.map((v: any) => {
      console.log(v);
      console.log(param);
      if (v.name === param.name) {
        v.value = { ...v.value, sql: value };
      }
      return v;
    });

    console.log(params);
    field.onChange([...params]);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Card sx={{ pb: 3 }}>
          <CardHeader title="파라미터" sx={{ mb: 2 }} />
          <Divider sx={{ borderStyle: 'dashed' }} />
          {currentTemplate?.parameters.map((parameter, index) => (
            <Grid container sx={{ p: 1 }} key={index}>
              <Grid item xs={12} md={2}>
                <Box sx={{ px: 2, py: 1, fontWeight: 'bold' }}>{parameter.name}</Box>
                <Box sx={{ px: 2, color: 'var(--palette-text-secondary)', fontStyle: 'italic' }}>
                  {parameter.type}
                </Box>
              </Grid>
              <Grid item xs={12} md={10}>
                {parameter.type === 'DataSource' && (
                  <>
                    <Box sx={{ py: 1, color: 'var(--palette-text-secondary)' }}>
                      {parameter.description}
                    </Box>
                    <TextField
                      label="데이터소스"
                      {...field}
                      select
                      fullWidth
                      error={!!error}
                      value={
                        parameters.find((p: any) => p.name === parameter.name)?.value ||
                        parameter.defaultValue
                      }
                      onChange={(event) =>
                        onTemplateParameterChanged(parameter, event.target.value, field)
                      }
                    >
                      {dataSources.map((option) => (
                        <MenuItem key={option.id} value={option.name}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </>
                )}
                {parameter.type === 'SQL' && (
                  <>
                    <Box sx={{ py: 1, color: 'var(--palette-text-secondary)' }}>
                      {parameter.description}
                    </Box>
                    <Editor
                      height="10vh"
                      language="sql"
                      value={
                        parameters.find((p: any) => p.name === parameter.name)?.value ||
                        parameter.defaultValue
                      }
                      onChange={(event) => onTemplateParameterChanged(parameter, event, field)}
                      /*        onChange={onSqlChanged(parameter)} */
                    />
                  </>
                )}
                {parameter.type !== 'DataSource' && parameter.type !== 'SQL' && (
                  <>
                    <Box sx={{ py: 1, color: 'var(--palette-text-secondary)' }}>
                      {parameter.description} {parameter.defaultValue}
                    </Box>
                    <TextField
                      {...field}
                      fullWidth
                      inputProps={{ readOnly: !editing }}
                      value={
                        parameters.find((p: any) => p.name === parameter.name)?.value ||
                        parameter.defaultValue
                      }
                      /*                      onChange={(event) => {
                        if (type === 'number') {
                          field.onChange(Number(event.target.value));
                        } else {
                          field.onChange(event.target.value);
                        }
                      }} */
                      onChange={(event) =>
                        onTemplateParameterChanged(parameter, event.target.value, field)
                      }
                    />
                  </>
                )}
              </Grid>
            </Grid>
          ))}
        </Card>
      )}
    />
  );
}
