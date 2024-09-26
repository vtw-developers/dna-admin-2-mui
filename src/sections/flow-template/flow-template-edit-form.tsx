import { z as zod } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Grid, styled } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import { ConfirmDialog } from '../../components/custom-dialog';
import { ParametersEditGrid } from '../api-info/parameters-edit-grid';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import {
  createFlowTemplate,
  deleteFlowTemplate,
  exportFlowTemplate,
  importFlowTemplate,
  updateFlowTemplate,
} from '../../actions/flow-template';

import type { FlowTemplate } from '../../types/flow-template';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  sid: zod.number().optional(),
  name: zod
    .string()
    .min(1, { message: '템플릿명을 입력하세요.' })
    .max(50, { message: '100자 이내로 입력하세요.' }),
  templateId: zod
    .string()
    .min(1, { message: '템플릿 ID를 입력하세요.' })
    .max(50, { message: '100자 이내로 입력하세요.' }),
  parameters: zod.any().array(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: FlowTemplate;
};

export function FlowTemplateEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.flow.template.root;
  const editPath = paths.flow.template.edit(entity?.sid);
  const detailsPath = paths.flow.template.details(entity?.sid);

  const defaultValues = useMemo(
    () => ({
      sid: entity?.sid,
      name: entity?.name || '',
      templateId: entity?.templateId || '',
      parameters:
        entity?.parameters.map((p) => {
          p.id = uuidv4();
          return p;
        }) || [],
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

  const onSubmit = handleSubmit(async (data) => {
    // data.requestParameters = rows;
    try {
      if (editMode === 'create') {
        await createFlowTemplate(data).then(() => toast.success('저장되었습니다.'));
        router.push(listPath);
      } else if (editMode === 'update') {
        await updateFlowTemplate(data).then(() => toast.success('수정되었습니다.'));
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
    await deleteFlowTemplate(data);
    toast.success('삭제되었습니다.');
    router.push(listPath);
  });

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="name"
            label="템플릿 명 (한글)"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="templateId"
            label="템플릿 ID (영문)"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
      </Grid>
    </Card>
  );

  const onParametersChanged = useCallback((rows: any[], key: string) => {
    // @ts-ignore
    setValue(key, rows);
  }, []);

  const [importedParameters, setImportedParameters] = useState(undefined);
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
      const result = await importFlowTemplate({ yaml: schemaYaml });
      setValue('name', result.name);
      setValue('templateId', result.templateId);
      setImportedParameters(result.parameters);
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
            title="템플릿 파라미터"
            editing={editing}
            initialRows={values.parameters}
            importedRows={importedParameters}
            onChange={(rows: any[]) => onParametersChanged(rows, 'parameters')}
          />
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
