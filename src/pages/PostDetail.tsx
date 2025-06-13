import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import PostCard from "../components/post/PostCard";
import CommentList from "../components/comment/CommentList";
import type { Comment } from "../components/comment/CommentItem";

// Mock data for a post
const mockPost = {
  id: "1",
  title: "This is a sample post title",
  content:
    "This is the full content of the post. It can be quite long and detailed, explaining the topic in depth.",
  author: {
    id: "user1",
    username: "waleedzynga",
    avatar: "",
  },
  community: {
    id: "community1",
    name: "Technology",
  },
  upvotes: 42,
  downvotes: 5,
  commentCount: 3,
  createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
  image: "/src/assets/posts/IMG-20210824-WA0078.jpg",
};

// Mock data for comments
const mockComments: Comment[] = [
  {
    id: "comment1",
    content: "هوهوهوهوهوهوهوهوهوهوهوهوهوهوهوهوهوه",
    author: {
      id: "user2",
      username: "amr-bella",
      avatar: "",
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    upvotes: 15,
    downvotes: 1,
    replies: [
      {
        id: "reply1",
        content: "ايه دا يغالي",
        author: {
          id: "user3",
          username: "mazen",
          avatar: "",
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        upvotes: 5,
        downvotes: 0,
      },
    ],
  },
  {
    id: "comment2",
    content: "why amrs real name is amr bella!!!",
    author: {
      id: "user4",
      username: "waleed",
      avatar: "",
    },
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
    upvotes: 8,
    downvotes: 0,
    replies: [],
  },
];

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<typeof mockPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the post and comments from an API
    const fetchPostAndComments = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // For demo purposes, we're using mock data
        setPost(mockPost);
        setComments(mockComments);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Post not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ mb: 3, overflow: "hidden" }}>
        <PostCard post={post} />
      </Paper>

      <CommentList postId={post.id} comments={comments} />
    </Container>
  );
};

export default PostDetail;
