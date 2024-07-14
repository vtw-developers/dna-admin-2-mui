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
  id: zod.number(),
  name: zod.string().min(1, { message: 'Name is required!' }),
  // description: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  // images: schemaHelper.files({ message: { required_error: 'Images is required!' } }),
  // code: zod.string().min(1, { message: 'Product code is required!' }),
  // sku: zod.string().min(1, { message: 'Product sku is required!' }),
  // quantity: zod.number().min(1, { message: 'Quantity is required!' }),
  // colors: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  // sizes: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  // tags: zod.string().array().min(2, { message: 'Must have at least 2 items!' }),
  // gender: zod.string().array().nonempty({ message: 'Choose at least one option!' }),
  // price: zod.number().min(1, { message: 'Price should not be $0.00' }),
  // // Not required
  // category: zod.string(),
  // priceSale: zod.number(),
  // subDescription: zod.string(),
  // taxes: zod.number(),
  // saleLabel: zod.object({ enabled: zod.boolean(), content: zod.string() }),
  // newLabel: zod.object({ enabled: zod.boolean(), content: zod.string() }),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: ApiInfo;
};

export function ApiInfoEditForm({ editMode, entity }: Props) {
  console.log(entity);

  const editing = editMode !== 'details';
  const router = useRouter();
  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      name: entity?.name || '',
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

      reset();
      toast.success(entity ? 'Update success!' : 'Create success!');
      router.push(paths.manage.api.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const confirmDelete = handleSubmit(async (data) => {
    // TODO: 삭제 확인 팝업
    console.log(data);
    await deleteApiInfo(data);
    router.push(paths.manage.api.root);
  });

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="API명" inputProps={{ readOnly: editMode === 'details' }} />
        <Field.Text name="name" label="API명" />
        <Field.Text name="name" label="API명" />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      {!editing && (
        <Button variant="contained" size="large" href={paths.manage.api.edit(entity?.id)}>
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
