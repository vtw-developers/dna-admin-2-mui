import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { createApiInfo } from '../../actions/api-info';

import type { ApiInfoItem } from '../../types/api-info';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
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
  currentProduct?: ApiInfoItem;
};

export function ApiInfoNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      // description: currentProduct?.description || '',
      // subDescription: currentProduct?.subDescription || '',
      // images: currentProduct?.images || [],
      // //
      // code: currentProduct?.code || '',
      // sku: currentProduct?.sku || '',
      // price: currentProduct?.price || 0,
      // quantity: currentProduct?.quantity || 0,
      // priceSale: currentProduct?.priceSale || 0,
      // tags: currentProduct?.tags || [],
      // taxes: currentProduct?.taxes || 0,
      // gender: currentProduct?.gender || [],
      // category: currentProduct?.category || PRODUCT_CATEGORY_GROUP_OPTIONS[0].classify[1],
      // colors: currentProduct?.colors || [],
      // sizes: currentProduct?.sizes || [],
      // newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      // saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
    }),
    [currentProduct]
  );

  const methods = useForm<NewProductSchemaType>({
    resolver: zodResolver(NewProductSchema),
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
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('aaa');
      await new Promise((resolve) => setTimeout(resolve, 500));

      createApiInfo(data).then((e) => {
        console.log(e);
      });

      reset();
      toast.success(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.manage.api.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="API명" />
        <Field.Text name="name" label="API명" />
        <Field.Text name="name" label="API명" />
      </Stack>
    </Card>
  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? '등록' : '저장'}
      </LoadingButton>
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
