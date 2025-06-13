import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import CommentItem from './CommentItem';
// Proper type-only import
import type { Comment } from './CommentItem';

interface CommentListProps {
  postId: string;
  comments: Comment[];
}

const CommentList = ({ postId, comments }: CommentListProps) => {
  const [commentText, setCommentText] = useState('');
  const [displayedComments, setDisplayedComments] = useState<Comment[]>(comments);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the comment to an API
    console.log('Submitting comment for post:', postId, commentText);
    
    // Mock adding a new comment
    const newComment: Comment = {
      id: `temp-${Date.now()}`,
      content: commentText,
      author: {
        id: 'current-user',
        username: 'currentUser',
        avatar: '',
      },
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
    };
    
    setDisplayedComments([newComment, ...displayedComments]);
    setCommentText('');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comments ({displayedComments.length})
      </Typography>
      
      {/* Comment form */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
        <Box component="form" onSubmit={handleCommentSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What are your thoughts?"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!commentText.trim()}
            >
              Comment
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Comments list */}
      {displayedComments.length > 0 ? (
        displayedComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No comments yet. Be the first to comment!
        </Typography>
      )}
    </Box>
  );
};

export default CommentList;