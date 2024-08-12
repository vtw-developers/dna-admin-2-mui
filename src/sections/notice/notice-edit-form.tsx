import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { varAlpha } from '../../theme/styles';
import { fDate } from '../../utils/format-time';
import { Iconify } from '../../components/iconify';
import { useBoolean } from '../../hooks/use-boolean';
import { ConfirmDialog } from '../../components/custom-dialog';
import { DnaDateRangeBox } from '../../components/form/dna-date-range-box';
import { DnaBottomButtons } from '../../components/dna-form/dna-bottom-buttons';
import { download, createBoard, deleteBoard, updateBoard } from '../../actions/board';

import type { Board } from '../../types/board'; // ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.number().optional(),
  boardMasterId: zod.number(),
  title: zod.string().min(1, { message: 'Name is required!' }),
  content: zod.string(),
  boardNo: zod.number().optional(),
  parentId: zod.number().optional(),
  viewCount: zod.number().optional(),
  useYn: zod.boolean(),
  pinYn: zod.boolean().optional(),
  popupYn: zod.boolean().optional(),
  pinStartTime: zod.string().optional(),
  pinEndTime: zod.string().optional(),
  popupStartTime: zod.string().optional(),
  popupEndTime: zod.string().optional(),
  files: zod.any().array(),
  removedFiles: zod.any().array(),
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
      boardMasterId: entity?.boardMasterId || 1,
      title: entity?.title || '',
      content: entity?.content || '',
      boardNo: entity?.boardNo || 0,
      parentId: entity?.parentId || 0,
      viewCount: entity?.viewCount || 0,
      useYn: entity?.useYn || true,
      pinYn: entity?.pinYn || false,
      popupYn: entity?.popupYn || false,
      pinStartTime: entity?.pinStartTime || undefined,
      pinEndTime: entity?.pinEndTime || undefined,
      popupStartTime: entity?.popupStartTime || undefined,
      popupEndTime: entity?.popupEndTime || undefined,
      files: entity?.files || [],
      removedFiles: [],
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

  const onSubmit = handleSubmit(async (data: Board) => {
    const format = new FormData();
    if (data.files?.length > 0) {
      data.files.forEach((file) => {
        format.append('files', file);
      });
    }
    format.append('entity', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    try {
      if (editMode === 'create') {
        await createBoard(format).then(() => toast.success('저장되었습니다.'));
        router.push(listPath);
      } else if (editMode === 'update') {
        await updateBoard(format).then(() => toast.success('수정되었습니다.'));
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
  const handleRemoveAllFiles = useCallback(() => {
    setValue('files', [], { shouldValidate: true });
  }, [setValue]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.files && values.files?.filter((file) => file.id !== inputFile.id);
      setValue('files', filtered, { shouldValidate: true });

      if (!(inputFile instanceof File)) {
        setValue('removedFiles', [...values.removedFiles, inputFile], { shouldValidate: true });
      }
    },
    [setValue, values]
  );
  const downloadFile = async (fileId: number) => {
    const fileName = values.files.find((e) => e.id === fileId)?.originalFileName;
    const file = await download(fileId);
    const blob = new Blob([file], { type: 'image/png' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const renderDetails = (
    <Card>
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={12}>
          <Field.Text name="title" label="제목" inputProps={{ readOnly: editMode === 'details' }} />
        </Grid>
        <Grid item xs={12} md={1}>
          <Field.Switch
            name="pinYn"
            label="중요표기"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={11}>
          <DnaDateRangeBox
            startValue={values.pinStartTime}
            endValue={values.pinEndTime}
            onValueChange={handleFilterDate}
            startLabel="시작일시"
            endLabel="종료일시"
            startFieldName="pinStartTime"
            endFieldName="pinEndTime"
            format="YYYY-MM-DD HH:mm:ss"
            readonly={editMode === 'details' || !values.pinYn}
          />
        </Grid>
        <Grid item xs={12} md={1}>
          <Field.Switch
            name="popupYn"
            label="팝업표기"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={11}>
          <DnaDateRangeBox
            startValue={values.popupStartTime}
            endValue={values.popupEndTime}
            onValueChange={handleFilterDate}
            startLabel="시작일시"
            endLabel="종료일시"
            startFieldName="popupStartTime"
            endFieldName="popupEndTime"
            format="YYYY-MM-DD HH:mm:ss"
            readonly={editMode === 'details' || !values.popupYn}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          {editing && <Field.Editor name="content" sx={{ maxHeight: 480 }} />}
          {!editing && (
            <Box
              sx={{
                px: 2,
                border: (theme) =>
                  `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: values.content }} />
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={12}>
          <Divider sx={{ my: 2 }} />
          {editing && (
            <Field.Upload
              name="files"
              multiple
              // thumbnail
              maxSize={3145728}
              onRemove={handleRemoveFile}
              onRemoveAll={handleRemoveAllFiles}
            />
          )}
          {!editing &&
            values.files?.map((file, index) => {
              const { originalFileName } = file;
              return (
                <Box
                  onClick={() => downloadFile(file.id)}
                  component="li"
                  key={index}
                  sx={{
                    py: 1,
                    pr: 1,
                    pl: 1.5,
                    gap: 1.5,
                    display: 'flex',
                    borderRadius: 1,
                    alignItems: 'center',
                    border: (theme) =>
                      `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                  }}
                >
                  <Iconify icon="mingcute:download-2-line" width={16} />
                  {originalFileName}
                </Box>
              );
            })}
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
