import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useBoolean } from '../../hooks/use-boolean';
import { ConfirmDialog } from '../../components/custom-dialog';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import { createCtiInfo, deleteCtiInfo, updateCtiInfo } from '../../actions/cti-info';
import { ServiceGroupSearchBox } from '../../components/dna-form/dna-service-group-search-box';

import type { CtiInfo } from '../../types/cti-info';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.number().optional(),
  name: zod.string().min(1, { message: 'Name is required!' }),
  // httpMethod: zod.string(),
  // url: zod.string(),
  // serviceGroupId: zod.number(),
  // enabled: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: CtiInfo;
};

export function CtiInfoEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.manage.cti.root;
  const editPath = paths.manage.cti.edit(entity?.id);
  const detailsPath = paths.manage.cti.details(entity?.id);

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
      if (editMode === 'create') {
        await createCtiInfo(data).then(() => toast.success('저장되었습니다.'));
        router.push(listPath);
      } else if (editMode === 'update') {
        await updateCtiInfo(data).then(() => toast.success('수정되었습니다.'));
        router.push(editPath);
      }
    } catch (error) {
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
    await deleteCtiInfo(data);
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
          <Field.Text name="name" label="CTI명" inputProps={{ readOnly: editMode === 'details' }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ServiceGroupSearchBox name="serviceGroupId" />
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
