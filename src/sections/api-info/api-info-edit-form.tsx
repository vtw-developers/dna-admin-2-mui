import { z as zod } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import { ParametersEditGrid } from './parameters-edit-grid';
import { ConfirmDialog } from '../../components/custom-dialog';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import { createApiInfo, deleteApiInfo, updateApiInfo } from '../../actions/api-info';
import { ServiceGroupSearchBox } from '../../components/dna-form/dna-service-group-search-box';

import type { ApiInfo } from '../../types/api-info';

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

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: ApiInfo;
};

export function ApiInfoEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.manage.api.root;
  const editPath = paths.manage.api.edit(entity?.id);
  const detailsPath = paths.manage.api.details(entity?.id);

  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      name: entity?.name || '',
      httpMethod: entity?.httpMethod || 'GET',
      url: entity?.url || '',
      serviceGroupId: entity?.serviceGroupId || 0,
      enabled: entity?.enabled || false,
      flowId: entity?.flowId || '',
      flowMetaYaml: entity?.flowMetaYaml || '',
      requestParameters:
        entity?.requestParameters.map((p) => {
          p.id = uuidv4();
          return p;
        }) || [],
      responseElements:
        entity?.responseElements.map((p) => {
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
        await createApiInfo(data).then(() => toast.success('저장되었습니다.'));
        router.push(listPath);
      } else if (editMode === 'update') {
        await updateApiInfo(data).then(() => toast.success('수정되었습니다.'));
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
    await deleteApiInfo(data);
    toast.success('삭제되었습니다.');
    router.push(listPath);
  });

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={6}>
          <Field.Text
            name="name"
            label="API명"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ServiceGroupSearchBox
            label="서비스그룹"
            onChange={(e: number) => setValue('serviceGroupId', e)}
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
          <Field.Switch
            name="enabled"
            label="사용여부"
            labelPlacement="start"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
      </Grid>
    </Card>
  );

  const onUploaded = (e: { target: { files: any } }) => {
    const { files } = e.target;
    if (files.length < 1) {
      return;
    }
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = (f) => {
      const flowMetaYaml = f.target?.result as string;
      const flowMeta = yaml.load(flowMetaYaml);
      const pack = flowMeta.package ? `${flowMeta.package}.` : '';
      const flowId = pack + flowMeta.name;
      setValue('flowId', flowId);
      setValue('flowMetaYaml', flowMetaYaml);
    };
    fileReader.readAsText(file);
  };

  const syncFormData = () => {
    const { flowMetaYaml } = values;
    const flowMeta = yaml.load(flowMetaYaml);

    const { nodes } = flowMeta.diagram;
    const restNode = nodes.find(
      (node: { data: { component: string } }) => node.data.component === 'Rest'
    );

    if (restNode) {
      const { httpMethod } = restNode.data;
      const url = restNode.data.path;
      const { requestParameters } = restNode.data;
      const { responseElements } = restNode.data;

      setValue('httpMethod', httpMethod);
      setValue('url', url);
      setValue('requestParameters', requestParameters);
      setValue('responseElements', responseElements);
    }
  };

  const renderDna = (
    <Card>
      <CardHeader title="DnA 플로우" subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Stack direction="row" spacing={2} sx={{ px: 3, pt: 3 }}>
        <Button variant="soft" color="primary" component="label">
          메타 파일 선택...
          <input type="file" hidden onChange={onUploaded} />
        </Button>
        <Button variant="soft" color="info" component="label">
          메타정보 보기
        </Button>
        <Button variant="soft" color="success" component="label" onClick={syncFormData}>
          동기화
        </Button>
      </Stack>
      <Stack spacing={2} sx={{ p: 3 }}>
        <Field.Text
          name="flowId"
          label="플로우 ID"
          variant="outlined"
          inputProps={{ readOnly: false }}
        />
      </Stack>
    </Card>
  );

  const onParametersChanged = (rows: any[], key: string) => {
    // @ts-ignore
    setValue(key, [...rows]);
  };

  return (
    <>
      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
          {renderDetails}
          {renderDna}
          <ParametersEditGrid
            title="요청 파라미터"
            editing={editing}
            initialRows={defaultValues.requestParameters}
            onChange={(rows: any[]) => onParametersChanged(rows, 'requestParameters')}
          />
          <ParametersEditGrid
            title="응답 파라미터"
            editing={editing}
            initialRows={defaultValues.responseElements}
            onChange={(rows: any[]) => onParametersChanged(rows, 'responseElements')}
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
