import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
  CardMedia,
  Button,
  Divider,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

// Define the Post type
interface Author {
  id: string;
  username: string;
  avatar: string;
}

interface Community {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  community: Community;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
  image?: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [voteStatus, setVoteStatus] = useState<"up" | "down" | null>(null);
  const [saved, setSaved] = useState(false);
  const [voteCount, setVoteCount] = useState(post.upvotes - post.downvotes);

  const handleUpvote = () => {
    if (voteStatus === "up") {
      setVoteStatus(null);
      setVoteCount(voteCount - 1);
    } else {
      setVoteStatus("up");
      setVoteCount(voteStatus === "down" ? voteCount + 2 : voteCount + 1);
    }
  };

  const handleDownvote = () => {
    if (voteStatus === "down") {
      setVoteStatus(null);
      setVoteCount(voteCount + 1);
    } else {
      setVoteStatus("down");
      setVoteCount(voteStatus === "up" ? voteCount - 2 : voteCount - 1);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex" }}>
        {/* Vote buttons column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
            bgcolor: "background.default",
            borderRadius: "8px 0 0 8px",
          }}
        >
          <IconButton
            onClick={handleUpvote}
            color={voteStatus === "up" ? "secondary" : "default"}
          >
            <ArrowUpwardIcon sx={{ fontSize: "28px" }} />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ my: 1 }}>
            {voteCount}
          </Typography>
          <IconButton
            onClick={handleDownvote}
            color={voteStatus === "down" ? "error" : "default"}
          >
            <ArrowDownwardIcon sx={{ fontSize: "28px" }} />
          </IconButton>
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1 }}>
          <CardContent sx={{ pb: 1, pt: 3, px: 3 }}>
            {/* Post metadata */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Chip
                component={Link}
                to={`/community/${post.community.id}`}
                label={post.community.name}
                clickable
                sx={{ mr: 2, textDecoration: "none", px: 1, height: 32 }}
              />
              <Typography variant="body1" color="text.secondary">
                Posted by{" "}
                <Link
                  to={`/profile/${post.author.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    component="span"
                    variant="body1"
                    color="primary"
                    sx={{ fontWeight: "medium" }}
                  >
                    u/{post.author.username}
                  </Typography>
                </Link>{" "}
                {formatRelativeTime(post.createdAt)}
              </Typography>
            </Box>

            {/* Post title */}
            <Typography
              variant="h5"
              component={Link}
              to={`/post/${post.id}`}
              sx={{
                textDecoration: "none",
                color: "text.primary",
                display: "block",
                mb: 2,
                fontWeight: "medium",
                lineHeight: 1.3,
              }}
            >
              {post.title}
            </Typography>

            {/* Post content */}
            <Typography
              variant="body1"
              sx={{ mb: 3, fontSize: "1rem", lineHeight: 1.6 }}
            >
              {post.content.length > 300
                ? `${post.content.substring(0, 300)}...`
                : post.content}
            </Typography>

            {/* Post image if available */}
            {post.image && (
              <CardMedia
                component="img"
                image={post.image}
                alt={post.title}
                sx={{ borderRadius: 2, maxHeight: 600, mb: 3 }}
              />
            )}
          </CardContent>

          <Divider />

          {/* Post actions */}
          <CardActions sx={{ justifyContent: "space-between", px: 3, py: 1.5 }}>
            <Button
              startIcon={<ChatBubbleOutlineIcon />}
              component={Link}
              to={`/post/${post.id}`}
              sx={{
                color: "text.secondary",
                py: 1,
                px: 2,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {post.commentCount} Comments
            </Button>

            <Box>
              <IconButton aria-label="share" sx={{ mx: 1 }}>
                <ShareIcon />
              </IconButton>
              <IconButton onClick={handleSave} aria-label="save">
                {saved ? (
                  <BookmarkIcon color="primary" />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Box>
          </CardActions>
        </Box>
      </Box>
    </Card>
  );
};

export default PostCard;
