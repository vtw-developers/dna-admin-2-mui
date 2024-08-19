import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { Divider, Typography } from '@mui/material';

import { BoardCommentForm } from './board-comment-form';
import { BoardCommentList } from './board-comment-list';
import { getComments, createComment, deleteComment } from '../../../actions/comment';

// ----------------------------------------------------------------------

type Props = {
  boardId: any;
};

export function BoardComment({ boardId }: Props) {
  const [comments, setComments] = useState({ count: 0, list: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getComments(boardId);
        setComments(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [boardId]);

  const save = async ({ comment }: any) => {
    const result = await createComment({ content: comment, boardId, useYn: true });
    reload();
  };

  const doDelete = async (id: number) => {
    const result = await deleteComment({ id });
    reload();
  };

  const reload = () => {
    const fetchData = async () => {
      try {
        const result = await getComments(boardId);
        setComments(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  };

  return (
    <>
      <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
        <Typography variant="h4">댓글</Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          ({comments.count})
        </Typography>
      </Stack>

      <BoardCommentForm onSave={save} />

      <Divider sx={{ mt: 5, mb: 2 }} />

      <BoardCommentList comments={comments} onDelete={doDelete} />
    </>
  );
}
