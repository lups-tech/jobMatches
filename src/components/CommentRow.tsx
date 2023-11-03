/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton, Typography } from '@mui/material';
import { Comment, DeleteCommentRequestBody } from '../types/innerTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendDeleteCommentRequest } from '../utils/mutationTools';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { User } from '@auth0/auth0-react';

interface CommentRowProps {
  comment: Comment;
  user: User | undefined;
  getAccessTokenSilently: any;
}

export const CommentRow = ({
  comment,
  user,
  getAccessTokenSilently,
}: CommentRowProps) => {
  const queryClient = useQueryClient();
  const mutationDeleteAComment = useMutation(sendDeleteCommentRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['allDevelopers']);
    },
  });
  const DeleteCommentHandle = ({
    commentId,
    getAccessTokenSilently,
  }: DeleteCommentRequestBody) => {
    mutationDeleteAComment.mutate({ commentId, getAccessTokenSilently });
  };
  return (
    <div className="flex justify-between">
      <div>
        <Typography variant="body1" style={{ maxWidth: '400px' }}>
          {comment.commentText}
        </Typography>
        <Typography variant="caption" style={{ maxWidth: '400px' }}>
          From {comment.userEmail}
        </Typography>
      </div>
      {user!.email === comment.userEmail && (
        <IconButton
          aria-label="discard"
          onClick={() =>
            DeleteCommentHandle({
              commentId: comment.id,
              getAccessTokenSilently,
            })
          }
        >
          <DeleteOutlineIcon />
        </IconButton>
      )}
    </div>
  );
};
