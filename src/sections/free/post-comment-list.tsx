import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from '../../components/iconify';

// ----------------------------------------------------------------------
export type IDateValue = string | number | null;
export type IPostComment = {
  id: string;
  name: string;
  avatarUrl: string;
  message: string;
  postedAt: IDateValue;
  users: { id: string; name: string; avatarUrl: string }[];
  replyComment: {
    id: string;
    userId: string;
    message: string;
    tagUser?: string;
    postedAt: IDateValue;
  }[];
};

type Props = {
  comments: any;
  onDelete: any;
};

export async function PostCommentList({ comments, onDelete }: Props) {
  const doDeleteComment = (e) => {
    console.log(e);
    const selectedComment = comments.list.find((comment) => comment.id === e);
    console.log(selectedComment);
    onDelete(selectedComment.id);
  };

  return (
    <>
      {comments.list.map((comment) => {
        const hasReply = !!comment.count;
        console.log(comment);

        return (
          <Box key={comment.id}>
            <Box
              sx={{
                pt: 3,
                display: 'flex',
                position: 'relative',
                ...(hasReply && { pl: 8 }),
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
            {/*            <div className="comment">
              <div className="comment-header">
                <div className="comment-info">
                  <div className="author">{comment.author}</div>
                  <div className="modified-time">{comment.modifiedTime}</div>
                </div>
                <div className="comment-buttons">
                                    <Button
                    icon="remove"
                    type="danger"
                    stylingMode="text"
                    onClick={() => doDeleteComment(id)}
                  />
                </div>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div> */}
          </Box>
        );
      })}
      {/*
      <Pagination count={8} sx={{ my: { xs: 5, md: 8 }, mx: 'auto' }} />
*/}
    </>
  );
}
