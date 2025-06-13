import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import CommunityHeader, { type Community as CommunityType } from '../components/community/CommunityHeader';
import PostCard from '../components/post/PostCard';
import { useCommunity } from '../store/CommunityContext';
import { useAuth } from '../store/AuthContext';

// Mock data for posts until we have a real API for posts
const mockPosts = [
  {
    id: 'post1',
    title: 'What programming language should I learn in 2023?',
    content: 'I\'m new to programming and want to start learning. What language would be best for a beginner in 2023?',
    author: {
      id: 'user1',
      username: 'johndoe',
      avatar: '',
    },
    community: {
      id: 'community1',
      name: 'Technology',
    },
    upvotes: 42,
    downvotes: 5,
    commentCount: 15,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 'post2',
    title: 'Just released my first open-source project!',
    content: 'After months of work, I\'ve finally released my first open-source project. It\'s a library for...',
    author: {
      id: 'user2',
      username: 'janedoe',
      avatar: '',
    },
    community: {
      id: 'community1',
      name: 'Technology',
    },
    upvotes: 128,
    downvotes: 2,
    commentCount: 32,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    image: 'https://source.unsplash.com/random/800x400/?code',
  },
];

const CommunityPage = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const { userCommunities, loading: communityLoading, error: communityError, fetchUserCommunities, generateInviteCode, joinCommunityWithCode, leaveCommunity, deleteCommunity, modifyCommunity } = useCommunity();
  const { user } = useAuth();
  
  const [community, setCommunity] = useState<CommunityType | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  
  // Modify community form state
  const [modifyFormData, setModifyFormData] = useState({
    name: '',
    description: ''
  });
  const [modifyBannerFile, setModifyBannerFile] = useState<File | null>(null);
  const [modifyBannerPreview, setModifyBannerPreview] = useState<string | null>(null);
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleJoinCommunity = async () => {
    try {
      await joinCommunityWithCode(joinCode);
      setOpenJoinDialog(false);
      setJoinCode('');
      showSnackbar('Successfully joined community', 'success');
      // Refresh community data
      await fetchUserCommunities();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to join community', 'error');
    }
  };
  
  const handleLeaveCommunity = async () => {
    if (!communityId) return;
    
    try {
      await leaveCommunity(communityId);
      showSnackbar('Successfully left community', 'success');
      navigate('/');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to leave community', 'error');
    }
  };
  
  const handleGenerateInviteCode = async () => {
    if (!communityId) return;
    
    try {
      const code = await generateInviteCode(communityId);
      setInviteCode(code);
      setOpenInviteDialog(true);
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to generate invite code', 'error');
    }
  };
  
  const handleDeleteCommunity = async () => {
    if (!communityId) return;
    
    try {
      await deleteCommunity(communityId);
      setOpenDeleteDialog(false);
      showSnackbar('Community deleted successfully', 'success');
      navigate('/');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to delete community', 'error');
    }
  };
  
  const handleOpenModifyDialog = () => {
    if (!community) return;
    
    // Initialize form with current community data
    // Exclude isPublic as per requirements
    setModifyFormData({
      name: community.name,
      description: community.description
    });
    
    // Set banner preview if available
    if (community.banner) {
      setModifyBannerPreview(community.banner);
    } else {
      setModifyBannerPreview(null);
    }
    
    setOpenModifyDialog(true);
  };
  
  const handleModifyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModifyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleModifyBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setModifyBannerFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setModifyBannerPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveModifyBanner = () => {
    setModifyBannerFile(null);
    setModifyBannerPreview(null);
  };
  
  const handleModifyCommunity = async () => {
    if (!communityId) return;
    
    try {
      // Convert image to byte array if available
      let bannerByteArray: number[] | undefined;
      
      if (modifyBannerFile) {
        const arrayBuffer = await modifyBannerFile.arrayBuffer();
        bannerByteArray = Array.from(new Uint8Array(arrayBuffer));
      }
      
      // Prepare data for API - explicitly only include name, description, and banner
      // Exclude isPublic as per requirements
      const communityData = {
        name: modifyFormData.name,
        description: modifyFormData.description,
        banner: bannerByteArray
      };
      
      await modifyCommunity(communityId, communityData);
      setOpenModifyDialog(false);
      showSnackbar('Community updated successfully', 'success');
      
      // Refresh community data
      await fetchUserCommunities();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update community', 'error');
    }
  };
  
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    // Fetch user communities if not already loaded
    if (userCommunities.length === 0) {
      fetchUserCommunities();
    }
  }, []);
  
  useEffect(() => {
    const fetchCommunityAndPosts = async () => {
      if (!communityId || communityLoading) return;
      
      setLoading(true);
      
      try {
        // Find the community in the user's communities
        const foundCommunity = userCommunities.find(c => c.communityId === communityId);
        
        if (foundCommunity) {
          // Convert to the format expected by CommunityHeader
          const communityData: CommunityType = {
            id: foundCommunity.communityId,
            name: foundCommunity.name,
            description: foundCommunity.description,
            // Convert banner from number[] to a data URL if available
            banner: foundCommunity.banner && foundCommunity.banner.length > 0 
              ? `data:image/jpeg;base64,${btoa(String.fromCharCode.apply(null, foundCommunity.banner))}` 
              : undefined,
            memberCount: foundCommunity.memberCount || 0,
            createdAt: foundCommunity.createdAt || new Date().toISOString(),
            isJoined: true, // User is a member since it's in their communities list
            isModerator: foundCommunity.creatorId === user?.id, // User is creator
            tags: foundCommunity.tags,
          };
          
          setCommunity(communityData);
          setPosts(mockPosts); // Using mock posts until we have a real API for posts
        } else {
          // Community not found in user's communities
          setCommunity(null);
        }
      } catch (error) {
        console.error('Error fetching community:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityAndPosts();
  }, [communityId, userCommunities, user?.id, communityLoading]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!community) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Community not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {community && (
        <CommunityHeader 
          community={community} 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onJoin={() => setOpenJoinDialog(true)}
          onLeave={handleLeaveCommunity}
          onGenerateInvite={handleGenerateInviteCode}
          onDelete={() => setOpenDeleteDialog(true)}
        />
      )}
      
      {/* Tab content */}
      {community && activeTab === 0 && (
        <Box>
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No posts in this community yet.
              </Typography>
            </Paper>
          )}
        </Box>
      )}

      {community && activeTab === 1 && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            About {community.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {community.description}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Created
            </Typography>
            <Typography variant="body2">
              {new Date(community.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Members
            </Typography>
            <Typography variant="body2">
              {community.memberCount.toLocaleString()}
            </Typography>
          </Box>
          
          {community.isModerator && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleGenerateInviteCode}
              >
                Generate Invite Code
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={handleOpenModifyDialog}
              >
                Modify Community
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete Community
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {community && activeTab === 2 && (
        <Paper elevation={0} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Community Rules
          </Typography>
          {community.rules && community.rules.length > 0 ? (
            community.rules.map((rule, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  {index + 1}. {rule.title}
                </Typography>
                <Typography variant="body2">
                  {rule.description}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No rules have been set for this community.
            </Typography>
          )}
        </Paper>
      )}
      
      {/* Join Community Dialog */}
      <Dialog open={openJoinDialog} onClose={() => setOpenJoinDialog(false)}>
        <DialogTitle>Join Community</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the invite code to join this community.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="code"
            label="Invite Code"
            type="text"
            fullWidth
            variant="outlined"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoinDialog(false)}>Cancel</Button>
          <Button onClick={handleJoinCommunity} disabled={!joinCode.trim()}>Join</Button>
        </DialogActions>
      </Dialog>
      
      {/* Invite Code Dialog */}
      <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)}>
        <DialogTitle>Community Invite Code</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Share this code with others to invite them to your community:
          </DialogContentText>
          <TextField
            margin="dense"
            id="inviteCode"
            type="text"
            fullWidth
            variant="outlined"
            value={inviteCode}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInviteDialog(false)}>Close</Button>
          <Button 
            onClick={() => {
              navigator.clipboard.writeText(inviteCode);
              showSnackbar('Invite code copied to clipboard', 'success');
            }}
          >
            Copy to Clipboard
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Community Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Community</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this community? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteCommunity} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modify Community Dialog */}
      <Dialog open={openModifyDialog} onClose={() => setOpenModifyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modify Community</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="name"
            name="name"
            label="Community Name"
            type="text"
            fullWidth
            variant="outlined"
            value={modifyFormData.name}
            onChange={handleModifyInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={modifyFormData.description}
            onChange={handleModifyInputChange}
            sx={{ mb: 2 }}
          />
          
          {/* Banner Upload */}
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Community Banner
          </Typography>
          
          {!modifyBannerPreview ? (
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: 100, borderStyle: 'dashed' }}
            >
              Upload Banner Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleModifyBannerUpload}
              />
            </Button>
          ) : (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img 
                src={modifyBannerPreview} 
                alt="Banner preview" 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <Button 
                variant="contained" 
                color="error" 
                size="small"
                onClick={handleRemoveModifyBanner}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                Remove
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModifyDialog(false)}>Cancel</Button>
          <Button onClick={handleModifyCommunity} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CommunityPage;