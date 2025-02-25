import type { ChangeEvent } from 'react';

import Editor from '@monaco-editor/react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';

import type { FlowTemplate } from '../../types/flow-template';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  editing: boolean;
  parameters?: any;
  currentTemplate?: FlowTemplate;
  setValue?: any;
};

export function ParametersForm({ editing, currentTemplate, parameters, setValue }: Props) {
  console.log(parameters);

  const onTemplateParameterChanged =
    (e: FlowTemplate) => (event: ChangeEvent<HTMLInputElement>) => {
      if (!parameters.find((f: any) => f.name === e.name)) {
        parameters.push({ name: e.name, value: event.target.value });
      }
      const params = parameters.map((v: any) => {
        if (v.name === e.name) {
          v.value = event.target.value;
        }
        return v;
      });

      // @ts-ignore
      // setValue('parameters', [...params]);
    };

  const SqlQueryEditor = ({ parameter }: any) => {
    const { defaultValue } = parameter;

    const onSqlChanged = (e: FlowTemplate) => (value) => {
      if (!parameters.find((f: any) => f.name === e.name)) {
        parameters.push({ name: e.name, value });
      }
      const params = parameters.map((v: any) => {
        if (v.name === e.name) {
          v.value = value;
        }
        return v;
      });

      // @ts-ignore
      setValue('parameters', [...params]);
    };

    return (
      <Editor
        height="10vh"
        language="sql"
        defaultValue={defaultValue}
        /*        onChange={onSqlChanged(parameter)} */
      />
    );
  };

  return (
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
            {parameter.type === 'Sql' && (
              <>
                <Box sx={{ py: 1, color: 'var(--palette-text-secondary)' }}>
                  {parameter.description}
                </Box>
                <SqlQueryEditor parameter={parameter} />
              </>
            )}
            {parameter.type !== 'Sql' && (
              <>
                <Box sx={{ py: 1, color: 'var(--palette-text-secondary)' }}>
                  {parameter.description} {parameter.defaultValue}
                </Box>
                <TextField
                  fullWidth
                  inputProps={{ readOnly: !editing }}
                  value={parameter.defaultValue}
                  /*                  onChange={onTemplateParameterChanged(parameter)} */
                />
              </>
            )}
          </Grid>
        </Grid>
      ))}
    </Card>
  );
}
