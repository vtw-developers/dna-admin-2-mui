import { z as zod } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Grid, styled } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { SchemaEditor } from 'src/components/schema-editor/schema-editor';

import { useBoolean } from '../../hooks/use-boolean';
import { ConfirmDialog } from '../../components/custom-dialog';
import { ParametersEditGrid } from '../api-info/parameters-edit-grid';
import { RHFParametersEditor } from '../../components/hook-form/rhf-parameters';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import { getFlowTemplate, getFlowTemplates, exportFlowTemplate } from '../../actions/flow-template';
import {
  createTemplatedFlow,
  deleteTemplatedFlow,
  importTemplatedFlow,
  updateTemplatedFlow,
} from '../../actions/flow';

import type { Flow } from '../../types/flow';
import type { FlowTemplate } from '../../types/flow-template';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  sid: zod.number().optional(),
  flowType: zod.string(),
  flowId: zod
    .string()
    .min(1, { message: '플로우ID를 입력하세요.' })
    .max(100, { message: '100자 이내로 입력하세요.' }),
  name: zod
    .string()
    .min(1, { message: '플로우명을 입력하세요.' })
    .max(100, { message: '100자 이내로 입력하세요.' }),
  httpMethod: zod.string().nullish(),
  url: zod.string().nullish(),
  requestParameters: zod.any().array(),
  responseBody: zod.any(),
  templated: zod.boolean(),
  templateSid: zod.number().optional() /* .min(1, { message: '템플릿을 선택하세요.' }) */,
  parameters: zod.any().array(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: Flow;
};

const initialSchema = {
  id: 'root',
  name: 'root',
  type: 'Object',
  depth: 1,
  children: [],
};

export function FlowEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.flow.flow.root;
  const editPath = paths.flow.flow.edit(entity?.sid);
  const detailsPath = paths.flow.flow.details(entity?.sid);
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
      flowType: entity?.flowType || 'REST',
      flowId: entity?.flowId || '',
      name: entity?.name || '',
      httpMethod: entity?.httpMethod || 'GET',
      url: entity?.url || '',
      requestParameters:
        entity?.requestParameters?.map((p) => {
          p.id = uuidv4();
          return p;
        }) || [],
      responseBody: entity?.responseBody || initialSchema,
      templated: entity?.templated || false,
      templateSid: entity?.templateSid || undefined,
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
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();
  console.log(errors);

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

  const onSubmit = handleSubmit(async (data: any) => {
    console.log(data);
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

  const confirmDelete = handleSubmit(async (data: any) => {
    await deleteTemplatedFlow(data);
    toast.success('삭제되었습니다.');
    router.push(listPath);
  });

  const onParametersChanged = (rows: any[], key: string) => {
    // @ts-ignore
    setValue(key, rows);
  };

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={4}>
          <Field.Select
            variant="outlined"
            name="flowType"
            label="유형"
            inputProps={{ readOnly: editMode === 'details' }}
          >
            {['REST', 'BATCH', 'POLL'].map((option) => (
              <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                {option}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <Field.Text
            name="flowId"
            label="플로우 ID"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Field.Text
            name="name"
            label="플로우 명"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Select
            variant="outlined"
            name="templated"
            label="템플릿 사용"
            inputProps={{ readOnly: editMode === 'details' }}
          >
            {[
              { value: true, text: '사용' },
              { value: false, text: '미사용' },
            ].map((option, i) => (
              <MenuItem key={i} value={option.value} sx={{ textTransform: 'capitalize' }}>
                {option.text}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        {values.templated && (
          <Grid item xs={12} md={9}>
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
        )}
      </Grid>
    </Card>
  );

  const renderHttp = (
    <Card>
      <CardHeader title="HTTP 정보" subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Grid container spacing={3} sx={{ p: 3 }}>
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
      </Grid>
    </Card>
  );

  const [importedRequsetParameters, setImportedRequsetParameters] = useState(undefined);
  const [importedResponseBody, setImportedResponseBody] = useState(undefined);
  const [importedTemplateParameters, setImportedTemplateParameters] = useState(undefined);

  const importTemplate = (e: any) => {
    const { files } = e.target;
    if (files.length < 1) {
      return;
    }
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = async (f) => {
      const schemaYaml = f.target?.result as string;
      const result = await importTemplatedFlow({ yaml: schemaYaml });
      setValue('flowType', result.flowType);
      setValue('flowId', result.flowId);
      setValue('name', result.name);
      setValue('httpMethod', result.httpMethod);
      setValue('url', result.url);
      setValue('templated', result.templated);
      setValue('templateSid', result.templateSid);

      setImportedRequsetParameters(result.requestParameters);
      setImportedResponseBody(result.responseBody);
      setImportedTemplateParameters(result.parameters);
      setValue('parameters', result.parameters);
    };
    fileReader.readAsText(file);
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
          {values.flowType === 'REST' && renderHttp}
          {values.flowType === 'REST' && (
            <ParametersEditGrid
              title="요청 파라미터"
              editing={editing}
              initialRows={values.requestParameters}
              onChange={(rows: any[]) => onParametersChanged(rows, 'requestParameters')}
              importedRows={importedRequsetParameters}
            />
          )}
          {values.flowType === 'REST' && (
            <SchemaEditor
              title="응답 항목"
              initialData={values.responseBody}
              importedData={importedResponseBody}
              onChange={(data: any) => onParametersChanged(data, 'responseBody')}
            />
          )}
          {values.templated && values.templateSid && (
            /*            <ParametersForm
              editing={editing}
              currentTemplate={currentTemplate}
              parameters={values.parameters}
              setValue={setValue}
            /> */

            <RHFParametersEditor
              name="parameters"
              editing={editing}
              currentTemplate={currentTemplate}
              parameters={values.parameters}
              setValue={setValue}
            />
          )}
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
