import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

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

import { fDate } from '../../utils/format-time';
import { useBoolean } from '../../hooks/use-boolean';
import { ConfirmDialog } from '../../components/custom-dialog';
import { createBoard, deleteBoard, updateBoard } from '../../actions/board';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';

import type { Board } from '../../types/board';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.number().optional(),
  boardMasterId: zod.number(),
  title: zod.string().min(1, { message: 'Name is required!' }),
  content: zod.string(),
  pinYn: zod.boolean(),
  popupYn: zod.boolean(),
  useYn: zod.boolean(),
  pinStartTime: zod.string(),
  pinEndTime: zod.string(),
  popupStartTime: zod.string(),
  popupEndTime: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: Board;
};

export function NoticeEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.boards.notice.root;
  const editPath = paths.boards.notice.edit(entity?.id);
  const detailsPath = paths.boards.notice.details(entity?.id);

  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      boardMasterId: entity?.boardMasterId || undefined,
      title: entity?.title || '',
      content: entity?.content || '',
      pinYn: entity?.pinYn || false,
      popupYn: entity?.popupYn || false,
      useYn: entity?.useYn || false,
      pinStartTime: entity?.pinStartTime || '',
      pinEndTime: entity?.pinEndTime || '',
      popupStartTime: entity?.popupStartTime || '',
      popupEndTime: entity?.popupEndTime || '',
    }),
    [entity]
  );

  console.log(entity);
  console.log(typeof entity?.pinStartTime);

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

  const onSubmit = handleSubmit(async (data: Board) => {
    console.log(editMode);
    try {
      if (editMode === 'create') {
        await createBoard(data).then(() => toast.success('저장되었습니다.'));
        router.push(listPath);
      } else if (editMode === 'update') {
        await updateBoard(data).then(() => toast.success('수정되었습니다.'));
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

  const confirmDelete = handleSubmit(async (data: Board) => {
    await deleteBoard(data);
    toast.success('삭제되었습니다.');
    router.push(listPath);
  });

  const handleFilterDate = useCallback(
    (field: any) => (e: any) => {
      setValue(field, fDate(e, 'YYYY-MM-DD hh:mm:ss'));
    },
    [setValue]
  );

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={12}>
          <Field.Text name="title" label="제목" inputProps={{ readOnly: editMode === 'details' }} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Switch
            name="pinYn"
            label="중요표기"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          {/* <DnaDateRangeBox
            startValue={values.pinStartTime || ''}
            endValue={values.pinEndTime || ''}
            onValueChange={handleFilterDate}
            startLabel="시작일시"
            endLabel="종료일시"
            startFieldName="pinStartTime"
            endFieldName="pinEndTime"
            format="YYYY-MM-DD HH:mm:ss"
            readonly={editMode === 'details' || !values.pinYn}
          /> */}
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Switch
            name="popupYn"
            label="팝업표기"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          {/* <DnaDateRangeBox
            startValue={values.popupStartTime || null}
            endValue={values.popupEndTime || null}
            onValueChange={handleFilterDate}
            startLabel="시작일시"
            endLabel="종료일시"
            startFieldName="popupStartTime"
            endFieldName="popupEndTime"
            format="YYYY-MM-DD HH:mm:ss"
            readonly={editMode === 'details' || !values.popupYn}
          /> */}
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Editor name="content" sx={{ maxHeight: 480 }} />
        </Grid>
        <Grid item xs={12} md={12} />
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
