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
import { deleteApiInfo } from '../../actions/api-info';
import { getScheduableFlows } from '../../actions/flow';
import { ConfirmDialog } from '../../components/custom-dialog';
import { createSchedule, updateSchedule } from '../../actions/schedule';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';

import type { Schedule } from '../../types/schedule';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.number().optional(),
  flowSid: zod.number(),
  cronExpr: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: Schedule;
};

export function ScheduleEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.manage.schedule.root;
  const editPath = paths.manage.schedule.edit(entity?.ctiInfoId);
  const detailsPath = paths.manage.schedule.details(entity?.ctiInfoId);

  const [schedulableFlows, setSchedulableFlows] = useState([]);
  useEffect(() => {
    getScheduableFlows().then((e) => {
      console.log(e);
      setSchedulableFlows([...e]);
    });
  }, []);

  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      flowSid: entity?.flowSid || '',
      cronExpr: entity?.cronExpr || '',
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editMode === 'create') {
        await createSchedule(data).then(() => toast.success('저장되었습니다.'));
        router.push(detailsPath);
      } else if (editMode === 'update') {
        await updateSchedule(data).then(() => toast.success('수정되었습니다.'));
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
          <Field.Select
            variant="outlined"
            name="flowSid"
            label="플로우"
            inputProps={{ readOnly: editMode === 'details' }}
          >
            {schedulableFlows.map((option) => (
              <MenuItem key={option.sid} value={option.sid} sx={{ textTransform: 'capitalize' }}>
                {option.name}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="cronExpr"
            label="스케줄"
            inputProps={{ readOnly: editMode === 'details' }}
          />
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
