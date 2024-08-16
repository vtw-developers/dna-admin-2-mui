import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { Divider, Typography } from '@mui/material';

import { PostCommentForm } from './post-comment-form';
import { PostCommentList } from './post-comment-list';
import { getComments, createComment } from '../../actions/comment';

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

  const onSave = async ({ comment }) => {
    console.log(comment);
    const result = await createComment({ content: comment, boardId, useYn: true });
    console.log(result);

    const fetchData = async () => {
      try {
        const result = await getComments(boardId);
        setComments(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // .then(() => {
    //   notify('정상적으로 등록되었습니다.', 'success', 2000);
    //   setComment({...initCommentData});
    //   loadComment();
    // })
    // .catch(() => notify('예기치 못한 오류가 발생했습니다.', 'error', 2000));
  };

  return (
    <>
      <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
        <Typography variant="h4">댓글</Typography>

        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          {/*           ({post?.comments.length}) */}(0)
        </Typography>
      </Stack>

      <PostCommentForm onSave={onSave} />

      <Divider sx={{ mt: 5, mb: 2 }} />

      <PostCommentList comments={comments} />
    </>
  );
}
