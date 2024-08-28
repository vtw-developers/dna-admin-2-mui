import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
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
import {
  createBoardMaster,
  deleteBoardMaster,
  updateBoardMaster,
} from '../../actions/board-master';

import type { BoardMaster } from '../../types/board-master';

// ----------------------------------------------------------------------

export type SchemaType = zod.infer<typeof Schema>;

export const Schema = zod.object({
  id: zod.number().min(1, { message: 'id를 입력하세요.' }),
  name: zod
    .string()
    .min(1, { message: '게시판 이름를 입력하세요.' })
    .max(50, { message: '50자 이내로 입력하세요.' }),
  instruction: zod.string().max(10, { message: '10자 이내로 입력하세요.' }),
  fileAttachYn: zod.boolean(),
  replyYn: zod.boolean(),
  commentYn: zod.boolean(),
  pinYn: zod.boolean(),
  popupYn: zod.boolean(),
  useYn: zod.boolean(),
});

// ----------------------------------------------------------------------

type Props = {
  editMode: string;
  entity?: BoardMaster;
};

export function BoardMasterEditForm({ editMode, entity }: Props) {
  const editing = editMode !== 'details';
  const router = useRouter();
  const confirm = useBoolean();

  const listPath = paths.manage.board.root;
  const editPath = paths.manage.board.edit(entity?.id);
  const detailsPath = paths.manage.board.details(entity?.id);

  const defaultValues = useMemo(
    () => ({
      id: entity?.id,
      name: entity?.name || '',
      instruction: entity?.instruction || '',
      fileAttachYn: entity?.fileAttachYn || false,
      replyYn: entity?.replyYn || false,
      commentYn: entity?.commentYn || false,
      pinYn: entity?.pinYn || false,
      popupYn: entity?.popupYn || false,
      useYn: entity?.useYn || false,
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
        await createBoardMaster(data).then(() => toast.success('저장되었습니다.'));
        router.push(listPath);
      } else if (editMode === 'update') {
        await updateBoardMaster(data).then(() => toast.success('수정되었습니다.'));
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
    await deleteBoardMaster(data);
    toast.success('삭제되었습니다.');
    router.push(listPath);
  });

  const renderDetails = (
    <Card>
      <CardHeader title="기본정보" subheader="" sx={{ mb: 3 }} />
      <Divider />
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="id"
            label="Id"
            type="number"
            inputProps={{ readOnly: editMode !== 'create' }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="name"
            label="게시판명"
            inputProps={{ readOnly: editMode === 'details' }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Text
            name="instruction"
            label="게시판소개내용"
            variant="outlined"
            inputProps={{ readOnly: editMode === 'details' }}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field.Switch
            name="fileAttachYn"
            label="파일첨부가능여부"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text
            name="fileCount"
            label="첨부가능파일숫자"
            variant="outlined"
            type="number"
            disabled={!values.fileAttachYn}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Text
            name="fileMaxSize"
            label="첨부가능최대용량"
            variant="outlined"
            disabled={!values.fileAttachYn}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Switch
            name="replyYn"
            label="답장가능여부"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Switch
            name="commentYn"
            label="댓글가능여부"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Switch
            name="pinYn"
            label="중요표기여부"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Switch
            name="popupYn"
            label="메인화면 팝업 사용여부"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field.Switch
            name="useYn"
            label="게시판사용여부"
            slotProps={{ switch: { disabled: editMode === 'details' } }}
          />
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
