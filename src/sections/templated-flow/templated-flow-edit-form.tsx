import type { ChangeEvent } from 'react';

import { z as zod } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Grid, styled } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { SchemaEditor } from 'src/components/schema-editor/schema-editor';

import { useBoolean } from '../../hooks/use-boolean';
import { ConfirmDialog } from '../../components/custom-dialog';
import { ParametersEditGrid } from '../api-info/parameters-edit-grid';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import { getFlowTemplate, getFlowTemplates, exportFlowTemplate } from '../../actions/flow-template';
import {
  createTemplatedFlow,
  deleteTemplatedFlow,
  importTemplatedFlow,
  updateTemplatedFlow,
} from '../../actions/templated-flow';

import type { FlowTemplate } from '../../types/flow-template';
import type { TemplatedFlow } from '../../types/templated-flow';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  sid: zod.number().optional(),
  flowId: zod
    .string()
    .min(1, { message: '플로우ID를 입력하세요.' })
    .max(100, { message: '100자 이내로 입력하세요.' }),
  name: zod
    .string()
    .min(1, { message: '플로우명을 입력하세요.' })
    .max(100, { message: '100자 이내로 입력하세요.' }),
  httpMethod: zod.string().min(1, { message: 'HTTP Method 를 입력하세요.' }),
  url: zod.string().min(1, { message: 'URL을 입력하세요.' }),
  requestParameters: zod.any().array(),
  responseBody: zod.any(),
  templateSid: zod.number().min(1, { message: '템플릿을 선택하세요.' }),
  parameters: zod.any().array(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: TemplatedFlow;
};

const initialSchema = {
  id: 'root',
  name: 'root',
  type: 'Object',
  depth: 1,
  children: [],
};

export function TemplatedFlowEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.flow.templatedFlow.root;
  const editPath = paths.flow.templatedFlow.edit(entity?.sid);
  const detailsPath = paths.flow.templatedFlow.details(entity?.sid);
  const [templates, setTemplates] = useState<FlowTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<FlowTemplate>();

  useEffect(() => {
    getFlowTemplates().then((e) => {
      setTemplates([...e]);
    });
  }, []);

  const defaultValues = useMemo(
    () => ({
      sid: entity?.sid,
      flowId: entity?.flowId || '',
      name: entity?.name || '',
      httpMethod: entity?.httpMethod || 'GET',
      url: entity?.url || '',
      requestParameters:
        entity?.requestParameters.map((p) => {
          p.id = uuidv4();
          return p;
        }) || [],
      responseBody: entity?.responseBody || initialSchema,
      templateSid: entity?.templateSid || 0,
      parameters: entity?.parameters || [],
    }),
    [entity]
  );

  const methods = useForm<SchemaType>({
    resolver: zodResolver(Schema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (entity) {
      reset(defaultValues);
    }
  }, [entity, defaultValues, reset]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    values.templateSid &&
      getFlowTemplate(values.templateSid).then((e) => {
        setCurrentTemplate({ ...e });
      });
  }, [values.templateSid]);

  const onSubmit = handleSubmit(async (data) => {
    // data.requestParameters = rows;
    try {
      if (editMode === 'create') {
        await createTemplatedFlow(data).then(() => toast.success('저장되었습니다.'));
        router.push(listPath);
      } else if (editMode === 'update') {
        await updateTemplatedFlow(data).then(() => toast.success('수정되었습니다.'));
        router.push(detailsPath);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  });

  const cancelEdit = () => {
    if (editMode === 'create') {
      router.push(listPath);
    } else if (editMode === 'update') {
      router.push(detailsPath);
    }
  };

  const confirmDelete = handleSubmit(async (data) => {
    await deleteTemplatedFlow(data);
    toast.success('삭제되었습니다.');
    router.push(listPath);
  });

  const onTemplateParameterChanged =
    (e: FlowTemplate) => (event: ChangeEvent<HTMLInputElement>) => {
      if (!values.parameters.find((f) => f.name === e.name)) {
        values.parameters.push({ name: e.name, value: event.target.value });
      }
      const parameters = values.parameters.map((v) => {
        if (v.name === e.name) {
          v.value = event.target.value;
        }
        return v;
      });

      // @ts-ignore
      setValue('parameters', [...parameters]);
    };

  const onParametersChanged = (rows: any[], key: string) => {
    // @ts-ignore
    setValue(key, rows);
  };

  const parametersDetails = (
    <Grid item xs={12} md={12}>
      {currentTemplate && (
        <Card sx={{ pb: 3 }}>
          <CardHeader title="파라미터" sx={{ mb: 2 }} />
          <Divider sx={{ borderStyle: 'dashed' }} />
          {currentTemplate.parameters.map((template, index) => (
            <Grid container sx={{ p: 1 }} key={index}>
              <Grid item xs={12} md={2}>
                <Box sx={{ px: 2, py: 1, fontWeight: 'bold' }}>{template.name}</Box>
                <Box sx={{ px: 2, color: 'var(--palette-text-secondary)', fontStyle: 'italic' }}>
                  {template.type}
                </Box>
              </Grid>
              <Grid item xs={12} md={10}>
                <Box sx={{ py: 1, color: 'var(--palette-text-secondary)' }}>
                  {template.description} {template.defaultValue}
                </Box>
                <TextField
                  fullWidth
                  inputProps={{ readOnly: editMode === 'details' }}
                  value={
                    values.parameters.find((f) => f.name === template.name)?.value ||
                    template.defaultValue
                  }
                  onChange={onTemplateParameterChanged(template)}
                />
              </Grid>
            </Grid>
          ))}
        </Card>
      )}
    </Grid>
  );
  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={6}>
          <Field.Text
            name="flowId"
            label="플로우 ID"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text
            name="name"
            label="플로우 명"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select
            variant="outlined"
            name="httpMethod"
            label="HTTP Method"
            inputProps={{ readOnly: editMode === 'details' }}
          >
            {['GET', 'POST'].map((option) => (
              <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                {option}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text
            name="url"
            label="URL"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Select
            variant="outlined"
            name="templateSid"
            label="템플릿 선택"
            inputProps={{ readOnly: editMode === 'details' }}
          >
            {templates.map((option) => (
              <MenuItem key={option.sid} value={option.sid} sx={{ textTransform: 'capitalize' }}>
                {option.name}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
      </Grid>
    </Card>
  );

  const [importedRequsetParameters, setImportedRequsetParameters] = useState(undefined);
  const [importedResponseBody, setImportedResponseBody] = useState(undefined);
  const [importedTemplateParameters, setImportedTemplateParameters] = useState(undefined);

  const importTemplate = (e: any) => {
    console.log('import');
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
      const result = await importTemplatedFlow({ yaml: schemaYaml });
      console.log(result);
      setValue('flowId', result.flowId);
      setValue('name', result.name);
      setValue('httpMethod', result.httpMethod);
      setValue('url', result.url);
      setValue('templateSid', result.templateSid);

      setImportedRequsetParameters(result.requestParameters);
      setImportedResponseBody(result.responseBody);
      setImportedTemplateParameters(result.parameters);
      setValue('parameters', result.parameters);
    };
    fileReader.readAsText(file);
  };

  console.log(defaultValues);

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

  const exportTemplate = async () => {
    const { yaml } = await exportFlowTemplate({ sid: entity?.sid });
    const element = document.createElement('a');
    const file = new Blob([yaml], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${entity?.templateId}.template.yaml`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack direction="row" spacing={2} sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" component="label">
            가져오기
            <VisuallyHiddenInput type="file" onChange={importTemplate} />
          </Button>
          <Button variant="outlined" onClick={exportTemplate}>
            내보내기
          </Button>
        </Stack>
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
          {renderDetails}
          <ParametersEditGrid
            title="요청 파라미터"
            editing={editing}
            initialRows={values.requestParameters}
            onChange={(rows: any[]) => onParametersChanged(rows, 'requestParameters')}
            importedRows={importedRequsetParameters}
          />
          <SchemaEditor
            title="응답 항목"
            initialData={values.responseBody}
            importedData={importedResponseBody}
            onChange={(data: any) => onParametersChanged(data, 'responseBody')}
          />
          {parametersDetails}
          <DnaBottomButtons
            editing={editing}
            listPath={listPath}
            editPath={editPath}
            confirm={confirm}
            isSubmitting={isSubmitting}
            cancelEdit={cancelEdit}
          />
        </Stack>
      </Form>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="삭제"
        content={<>선택한 항목을 삭제하시겠습니까?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirmDelete().then(() => {
                confirm.onFalse();
              });
            }}
          >
            삭제
          </Button>
        }
      />
    </>
  );
}
