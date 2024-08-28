import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type CommentSchemaType = zod.infer<typeof CommentSchema>;

export const CommentSchema = zod.object({
  comment: zod.string().min(1, { message: '댓글 내용을 입력하세요.' }),
});

// ----------------------------------------------------------------------

type Props = {
  onSave: (e: any) => void;
};

export function BoardCommentForm({ onSave }: Props) {
  const defaultValues = { comment: '' };

  const methods = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSave(data);
      reset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Field.Text
          name="comment"
          variant="outlined"
          placeholder="댓글을 입력해주세요"
          multiline
          rows={4}
        />

        <Stack direction="row" alignItems="center">
          <Stack direction="row" alignItems="center" flexGrow={1} />
          <LoadingButton type="submit" color="primary" variant="contained" loading={isSubmitting}>
            등록
          </LoadingButton>
        </Stack>
      </Stack>
    </Form>
  );
}
