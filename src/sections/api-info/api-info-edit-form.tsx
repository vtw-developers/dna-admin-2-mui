import { z as zod } from 'zod';
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
import { ConfirmDialog } from '../../components/custom-dialog';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import { createApiInfo, deleteApiInfo, updateApiInfo } from '../../actions/api-info';
import { ServiceGroupSearchBox } from '../../components/dna-form/dna-service-group-search-box';

import type { ApiInfo } from '../../types/api-info';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1, { message: 'Name is required!' }),
  httpMethod: zod.string(),
  url: zod.string(),
  serviceGroupId: zod.number(),
  enabled: zod.boolean(),
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
        <Grid item xs={12} md={12}>
          <Field.Switch
            name="enabled"
            label="사용여부"
            labelPlacement="start"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text name="name" label="API명" inputProps={{ readOnly: editMode === 'details' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Select
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
          <Field.Text name="url" label="URL" inputProps={{ readOnly: editMode === 'details' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ServiceGroupSearchBox value="aaaa" onChange={(e) => setValue('serviceGroupId', e)} />
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
              confirmDelete().then((e) => {
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
