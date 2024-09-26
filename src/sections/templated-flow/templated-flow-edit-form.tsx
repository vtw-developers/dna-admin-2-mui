import type { ChangeEvent } from 'react';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import { ConfirmDialog } from '../../components/custom-dialog';
import { getFlowTemplate, getFlowTemplates } from '../../actions/flow-template';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import {
  createTemplatedFlow,
  deleteTemplatedFlow,
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

  parameters: zod.any().array(),
  templateSid: zod.number().min(1, { message: '템플릿을 선택하세요.' }),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: TemplatedFlow;
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
      name: entity?.name || '',
      httpMethod: entity?.httpMethod || 'GET',
      url: entity?.url || '',
      parameters: entity?.parameters || [],
      templateSid: entity?.templateSid || 0,
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

  const onParametersChanged = (e: FlowTemplate) => (event: ChangeEvent<HTMLInputElement>) => {
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
                  defaultValue={
                    values.parameters.find((f) => f.name === template.name)?.value ||
                    template.defaultValue
                  }
                  onChange={onParametersChanged(template)}
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

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
          {renderDetails}
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
