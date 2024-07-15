import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { createApiInfo, deleteApiInfo, updateApiInfo } from '../../actions/api-info';

import type { ApiInfo } from '../../types/api-info';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1, { message: 'Name is required!' }),
  httpMethod: zod.string(),
  url: zod.string(),
  // serviceGroupId: zod.number(),
  // enabled: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: ApiInfo;
};

export function ApiInfoEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();

  const listPath = paths.manage.api.root;
  const editPath = paths.manage.api.edit(entity?.id);
  const detailsPath = paths.manage.api.details(entity?.id);

  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      name: entity?.name || '',
      httpMethod: entity?.httpMethod || 'GET',
      url: entity?.url || '',
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
      console.log(data);

      if (editMode === 'create') {
        await createApiInfo(data);
      } else if (editMode === 'update') {
        await updateApiInfo(data);
      }

      // reset();
      toast.success(entity ? 'Update success!' : 'Create success!');
      router.push(paths.manage.api.root);
    } catch (error) {
      console.error(error);
    }
  });

  const confirmDelete = handleSubmit(async (data) => {
    // TODO: 삭제 확인 팝업
    await deleteApiInfo(data);
    router.push(paths.manage.api.root);
  });

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="API명" inputProps={{ readOnly: editMode === 'details' }} />
        <Field.Text
          name="httpMethod"
          label="HTTP Method"
          inputProps={{ readOnly: editMode === 'details' }}
        />
        <Field.Text name="url" label="URL" inputProps={{ readOnly: editMode === 'details' }} />
        {/*        <Field.Text
          name="serviceGroupId"
          label="서비스 그룹"
          inputProps={{ readOnly: editMode === 'details' }}
        /> */}
        {/*        <Field.Text
          name="enabled"
          label="사용여부"
          inputProps={{ readOnly: editMode === 'details' }}
        /> */}
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      {!editing && (
        <Button variant="contained" size="large" href={editPath}>
          수정
        </Button>
      )}
      {!editing && (
        <Button variant="contained" size="large" onClick={confirmDelete}>
          삭제
        </Button>
      )}
      {editing && (
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          저장
        </LoadingButton>
      )}

      <Button variant="contained" size="large" href={listPath}>
        목록
      </Button>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderActions}
      </Stack>
    </Form>
  );
}
