import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  community: {
    id: string;
    name: string;
  };
  createdAt: string;
  votes: number;
  commentCount: number;
  tags?: string[];
  images?: string[];
}

interface PostContextType {
  posts: Post[];
  userPosts: Post[];
  communityPosts: (communityId: string) => Post[];
  getPost: (postId: string) => Post | undefined;
  createPost: (postData: Omit<Post, 'id' | 'createdAt' | 'votes' | 'commentCount'>) => Promise<Post>;
  updatePost: (postId: string, postData: Partial<Post>) => Promise<Post>;
  deletePost: (postId: string) => Promise<void>;
  votePost: (postId: string, direction: 'up' | 'down') => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider = ({ children }: PostProviderProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // Mock data for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPosts: Post[] = [
          {
            id: '1',
            title: 'Getting started with React',
            content: 'React is a JavaScript library for building user interfaces...',
            author: {
              id: '1',
              username: 'reactfan',
              avatar: 'https://via.placeholder.com/150',
            },
            community: {
              id: '1',
              name: 'Technology',
            },
            createdAt: new Date().toISOString(),
            votes: 42,
            commentCount: 5,
            tags: ['react', 'javascript', 'frontend'],
          },
          {
            id: '2',
            title: 'TypeScript tips and tricks',
            content: 'TypeScript adds static typing to JavaScript...',
            author: {
              id: '2',
              username: 'tsdev',
              avatar: 'https://via.placeholder.com/150',
            },
            community: {
              id: '1',
              name: 'Technology',
            },
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            votes: 28,
            commentCount: 3,
            tags: ['typescript', 'javascript', 'development'],
          },
          {
            id: '3',
            title: 'Best gaming monitors 2023',
            content: 'Looking for a new gaming monitor? Here are our top picks...',
            author: {
              id: '3',
              username: 'gamerguy',
              avatar: 'https://via.placeholder.com/150',
            },
            community: {
              id: '3',
              name: 'Gaming',
            },
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            votes: 15,
            commentCount: 7,
            tags: ['gaming', 'hardware', 'monitors'],
          },
        ];
        
        setPosts(mockPosts);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const userPosts = posts.filter(post => post.author.id === '1'); // Replace with actual user ID

  const communityPosts = (communityId: string) => {
    return posts.filter(post => post.community.id === communityId);
  };

  const getPost = (postId: string) => {
    return posts.find(post => post.id === postId);
  };

  const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'votes' | 'commentCount'>) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost: Post = {
        ...postData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        votes: 0,
        commentCount: 0,
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      setError('Failed to create post');
      console.error('Error creating post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId: string, postData: Partial<Post>) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return { ...post, ...postData };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      return updatedPosts.find(post => post.id === postId) as Post;
    } catch (err) {
      setError('Failed to update post');
      console.error('Error updating post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to delete post');
      console.error('Error deleting post:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const votePost = async (postId: string, direction: 'up' | 'down') => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            votes: post.votes + (direction === 'up' ? 1 : -1),
          };
        }
        return post;
      }));
    } catch (err) {
      setError('Failed to vote on post');
      console.error('Error voting on post:', err);
      throw err;
    }
  };

  const value = {
    posts,
    userPosts,
    communityPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    votePost,
    loading,
    error,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostContext;