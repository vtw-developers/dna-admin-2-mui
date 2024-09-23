import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
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
import { getFlowTemplates } from '../../actions/flow-template';
import { ConfirmDialog } from '../../components/custom-dialog';
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
  id: zod.number().optional(),
  name: zod
    .string()
    .min(1, { message: '게시판 이름를 입력하세요.' })
    .max(50, { message: '50자 이내로 입력하세요.' }),
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
  const editPath = paths.flow.templatedFlow.edit(entity?.id);
  const detailsPath = paths.flow.templatedFlow.details(entity?.id);
  const [templates, setTemplates] = useState<FlowTemplate[]>([]);

  useEffect(() => {
    getFlowTemplates().then((e) => {
      setTemplates([...e]);
    });
  }, []);

  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      name: entity?.name || '',
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

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Grid container spacing={3} sx={{ p: 3 }}>
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
