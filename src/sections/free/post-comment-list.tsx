import Box from '@mui/material/Box';

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
};

export function PostCommentList({ comments }: Props) {
  return (
    <>
      {comments.list.map((comment) => {
        const hasReply = !!comment.count;
        console.log(comment);

        return (
          <Box key={comment.id}>
            <div className="comment">
              <div className="comment-header">
                <div className="comment-info">
                  <div className="author">{comment.author}</div>
                  <div className="modified-time">{comment.modifiedTime}</div>
                </div>
                <div className="comment-buttons">
                  {/*                  <Button
                    icon="remove"
                    type="danger"
                    stylingMode="text"
                    onClick={() => doDeleteComment(id)}
                  /> */}
                </div>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          </Box>
        );
      })}
      {/*
      <Pagination count={8} sx={{ my: { xs: 5, md: 8 }, mx: 'auto' }} />
*/}
    </>
  );
}
