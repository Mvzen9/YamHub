import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import UserProfile from "../components/profile/UserProfile";
import { useAuth } from "../store/AuthContext";

// Mock user data
const mockUser = {
  id: "user1",
  username: "Mazen",
  displayName: "Mazen",
  avatar: "/src/assets/profile-mazen.jpg",
  bio: "Software developer passionate about web technologies and open source. I love building useful applications and contributing to the community.",
  joinDate: new Date(Date.now() - 3600000 * 24 * 365).toISOString(), // 1 year ago
  followers: 245,
  following: 112,
  posts: [
    {
      id: "post1",
      title: "graduation project",
      content: "cooking..",
      author: {
        id: "user1",
        username: "mazen",
        avatar: "/src/assets/posts/welcome.jpg",
      },
      community: {
        id: "community1",
        name: "Technology",
      },
      upvotes: 42,
      downvotes: 5,
      commentCount: 15,
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      image: "/src/assets/posts/Web_Photo_Editor (1).jpg",
    },
    {
      id: "post2",
      title: "Just finished my latest project!",
      content:
        "After months of work, I've finally completed my portfolio website. Check it out!",
      author: {
        id: "user1",
        username: "johndoe",
        avatar: "/src/assets//posts/Untitled-3-03.jpg",
      },
      community: {
        id: "community2",
        name: "WebDev",
      },
      upvotes: 28,
      downvotes: 2,
      commentCount: 7,
      image: "/src/assets//posts/Untitled-3-03.jpg",
      createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(), // 1 week ago
    },
  ],
  communities: [
    { id: "community1", name: "Test" },
    { id: "community2", name: "WebDev" },
    { id: "community3", name: "bta3a" },
    { id: "community4", name: "React" },
  ],
};

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<typeof mockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { user: authUser, isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch user data based on userId
    const fetchUserData = async () => {
      try {
        // Check if this is the current user's profile
        const isViewingOwnProfile = userId === "me" || (authUser && userId === authUser.id);
        
        if (isViewingOwnProfile && authUser) {
          // Use authenticated user data
          const currentUserData = {
            ...mockUser, // Use mock data for posts and communities for now
            id: authUser.id,
            username: authUser.username,
            displayName: authUser.displayName,
            avatar: authUser.avatar || "/src/assets/profile-mazen.jpg", // Fallback if no avatar
            bio: authUser.bio || "No bio available",
            joinDate: authUser.joinDate,
            followers: authUser.followers,
            following: authUser.following,
            birthdate: authUser.birthdate || undefined,
            gender: authUser.gender || undefined,
          };
          
          setUser(currentUserData);
          setIsCurrentUser(true);
        } else {
          // For demo purposes, we're using mock data for other users
          // In a real app, this would fetch the user data from an API
          await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call delay
          setUser(mockUser);
          setIsCurrentUser(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, authUser, isAuthenticated]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          User not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <UserProfile user={user} isCurrentUser={isCurrentUser} />
    </Container>
  );
};

export default ProfilePage;
