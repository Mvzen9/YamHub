import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Divider,
  Collapse,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Define the Comment type
export interface Author {
  id: string;
  username: string;
  avatar: string;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  maxDepth?: number;
}

const CommentItem = ({ comment, depth = 0, maxDepth = 5 }: CommentItemProps) => {
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [voteCount, setVoteCount] = useState(comment.upvotes - comment.downvotes);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);

  const handleUpvote = () => {
    if (voteStatus === 'up') {
      setVoteStatus(null);
      setVoteCount(voteCount - 1);
    } else {
      setVoteStatus('up');
      setVoteCount(voteStatus === 'down' ? voteCount + 2 : voteCount + 1);
    }
  };

  const handleDownvote = () => {
    if (voteStatus === 'down') {
      setVoteStatus(null);
      setVoteCount(voteCount + 1);
    } else {
      setVoteStatus('down');
      setVoteCount(voteStatus === 'up' ? voteCount - 2 : voteCount - 1);
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the reply to an API
    console.log('Submitting reply:', replyContent);
    setReplyContent('');
    setIsReplying(false);
    // Would add the new reply to the comment's replies array
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Vote buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1 }}>
          <IconButton
            size="small"
            onClick={handleUpvote}
            color={voteStatus === 'up' ? 'secondary' : 'default'}
          >
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" fontWeight="bold">
            {voteCount}
          </Typography>
          <IconButton
            size="small"
            onClick={handleDownvote}
            color={voteStatus === 'down' ? 'error' : 'default'}
          >
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Comment content */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Avatar
              src={comment.author.avatar}
              alt={comment.author.username}
              sx={{ width: 24, height: 24, mr: 1 }}
            />
            <Typography
              component={Link}
              to={`/profile/${comment.author.id}`}
              variant="body2"
              color="primary"
              sx={{ fontWeight: 'medium', textDecoration: 'none', mr: 1 }}
            >
              {comment.author.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatRelativeTime(comment.createdAt)}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
            {comment.content}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Button
              startIcon={<ReplyIcon />}
              size="small"
              onClick={() => setIsReplying(!isReplying)}
              sx={{ color: 'text.secondary', mr: 1 }}
            >
              Reply
            </Button>
            {comment.replies && comment.replies.length > 0 && (
              <Button
                size="small"
                onClick={toggleReplies}
                sx={{ color: 'text.secondary' }}
              >
                {showReplies ? 'Hide replies' : `Show ${comment.replies.length} replies`}
              </Button>
            )}
          </Box>

          {/* Reply form */}
          {isReplying && (
            <Box component="form" onSubmit={handleReplySubmit} sx={{ mt: 2, mb: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => setIsReplying(false)}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  type="submit"
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
              </Box>
            </Box>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && depth < maxDepth && (
            <Collapse in={showReplies}>
              <Box sx={{ pl: 2, borderLeft: 1, borderColor: 'divider', ml: 2, mt: 1 }}>
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                  />
                ))}
              </Box>
            </Collapse>
          )}
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default CommentItem;