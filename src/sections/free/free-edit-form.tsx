import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

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
  title: zod
    .string()
    .min(1, { message: '제목을 입력하세요.' })
    .max(100, { message: '100자 이내로 입력하세요.' }),
  content: zod.string().min(1, { message: '게시글을 입력하세요.' }),
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
  files: zod.any().array().optional(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: Board;
};

export function FreeEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.boards.free.root;
  const editPath = paths.boards.free.edit(entity?.id);
  const detailsPath = paths.boards.free.details(entity?.id);

  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      boardMasterId: entity?.boardMasterId || 2,
      title: entity?.title || '',
      content: entity?.content || '',
      boardNo: entity?.boardNo || 0,
      parentId: entity?.parentId || undefined,
      viewCount: entity?.viewCount || 0,
      useYn: entity?.useYn || true,
      pinYn: entity?.pinYn || false,
      popupYn: entity?.popupYn || false,
      pinStartTime: entity?.pinStartTime || undefined,
      pinEndTime: entity?.pinEndTime || undefined,
      popupStartTime: entity?.popupStartTime || undefined,
      popupEndTime: entity?.popupEndTime || undefined,
      files: entity?.files || [],
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

  const onSubmit = handleSubmit(async (data: any) => {
    const format = new FormData();
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

  const confirmDelete = handleSubmit(async (data: any) => {
    await deleteBoard(data);
    toast.success('삭제되었습니다.');
    router.push(listPath);
  });

  const renderDetails = (
    <Card>
      {/*      <CardHeader title="" subheader="" sx={{ mb: 3 }} />
      <Divider /> */}
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={9}>
          <Field.Text
            name="title"
            variant="outlined"
            label="제목"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field.Text
            name="viewCount"
            variant="outlined"
            type="number"
            label="조회수"
            inputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          {editMode !== 'details' && <Field.Editor name="content" sx={{ maxHeight: 800 }} />}
          {editMode === 'details' && (
            <Box className="html-content">
              <div dangerouslySetInnerHTML={{ __html: values.content }} />
            </Box>
          )}
        </Grid>
      </Grid>
    </Card>
  );

  return (
    <Box className="dna-edit-form">
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
    </Box>
  );
}
