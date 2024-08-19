import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from '../../../components/iconify';

import type { Comments } from '../../../types/board';

// ----------------------------------------------------------------------

type Props = {
  comments: Comments;
  onDelete: any;
};

export function BoardCommentList({ comments, onDelete }: Props) {
  const doDeleteComment = (e: any) => {
    const selectedComment = comments.list.find((comment) => comment.id === e);
    onDelete(selectedComment?.id);
  };

  return (
    <>
      {comments.list.map((comment) => (
        <Box key={comment.id}>
          <Box
            sx={{
              pt: 3,
              display: 'flex',
              position: 'relative',
            }}
          >
            <Stack
              flexGrow={1}
              sx={{ pb: 3, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
            >
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {comment.authorName} ({comment.authorId})
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {comment.modifiedTime}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                {comment.content}
              </Typography>
            </Stack>
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:delete-2-line" width={16} />}
              onClick={(e) => doDeleteComment(comment.id)}
              sx={{ right: 0, position: 'absolute' }}
            />
          </Box>
        </Box>
      ))}
    </>
  );
}
