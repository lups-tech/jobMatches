/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Typography,
  TextField,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import CommentRow from './CommentRow';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { AddCommentRequestBody, Developer } from '../types/innerTypes';
import { sendAddCommentRequest } from '../utils/mutationTools';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { User } from '@auth0/auth0-react';

interface CommentListProps {
  user: User | undefined;
  developer: Developer;
  getAccessTokenSilently: any;
}

const CommentList = ({
  user,
  developer,
  getAccessTokenSilently,
}: CommentListProps) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const commentValue = useRef<HTMLInputElement>();
  const queryClient = useQueryClient();

  const mutationAddAComment = useMutation(sendAddCommentRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['allDevelopers']);
    },
  });

  const addCommentHandle = () => {
    setIsAddingComment(!isAddingComment);
  };

  const sendAddCommentRequestHandle = ({
    commentText,
    userEmail,
    developerId,
    getAccessTokenSilently,
  }: AddCommentRequestBody) => {
    setIsAddingComment(false);
    if (!commentText) {
      return;
    }
    mutationAddAComment.mutate({
      commentText,
      userEmail,
      developerId,
      getAccessTokenSilently,
    });
  };

  const discardCommentHandle = () => {
    setIsAddingComment(false);
  };

  return (
    <div>
      {' '}
      <div className="flex flex-row justify-between">
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        {!isAddingComment && (
          <Button variant="outlined" onClick={addCommentHandle}>
            Add a comment
          </Button>
        )}
      </div>
      {isAddingComment && (
        <div className="flex flex-row justify-between">
          <TextField
            fullWidth
            inputRef={commentValue}
            id="standard-basic"
            label="New Comments:"
            variant="standard"
            sx={{ width: 400 }}
          />
          <div className="flex flex-row">
            <IconButton
              aria-label="save"
              onClick={() =>
                sendAddCommentRequestHandle({
                  commentText: commentValue.current!.value,
                  userEmail: user!.email ?? '',
                  developerId: developer.id,
                  getAccessTokenSilently,
                })
              }
            >
              <CheckCircleOutlineIcon />
            </IconButton>
            <IconButton aria-label="discard" onClick={discardCommentHandle}>
              <DoNotDisturbIcon />
            </IconButton>
          </div>
        </div>
      )}
      <div className="my-2">
        <Divider />
      </div>
      {!developer.comments.length && (
        <Typography variant="body1" style={{ maxWidth: '400px' }}>
          No comments yet
        </Typography>
      )}
      {developer.comments.map(comment => (
        <CommentRow
          key={comment.id}
          comment={comment}
          user={user}
          getAccessTokenSilently={getAccessTokenSilently}
        />
      ))}
      <div className="my-2">
        <Divider />
      </div>
    </div>
  );
};

export default CommentList;
