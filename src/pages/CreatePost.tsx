import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  IconButton,
  Alert,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    community: "",
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Mock communities data - in a real app, this would come from an API
  const communities = [
    { id: "1", name: "elklab" },
    { id: "2", name: "elotat" },
    { id: "3", name: "bta3a" },
    { id: "4", name: "zynga" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as { name: string; value: unknown };
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, currentTag.trim()],
        });
      }
      setCurrentTag("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Create preview URLs for the images
      const newPreviewUrls = filesArray.map((file) =>
        URL.createObjectURL(file)
      );

      setImages([...images, ...filesArray]);
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const newPreviewUrls = [...previewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);

    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.title || !formData.content || !formData.community) {
      setError("Please fill in all required fields");
      return;
    }

    // In a real app, this would call an API to create the post
    console.log("Post data:", { ...formData, images });

    // Mock successful post creation
    setTimeout(() => {
      // Redirect to home page after successful post creation
      navigate("/");
    }, 1000);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create a New Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Post Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="community-label">Community</InputLabel>
          <Select
            labelId="community-label"
            id="community"
            name="community"
            value={formData.community}
            label="Community"
            onChange={handleChange}
          >
            {communities.map((community) => (
              <MenuItem key={community.id} value={community.id}>
                {community.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          id="content"
          label="Post Content"
          name="content"
          multiline
          rows={6}
          value={formData.content}
          onChange={handleChange}
        />

        <TextField
          margin="normal"
          fullWidth
          id="tags"
          label="Tags (Press Enter to add)"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />

        {formData.tags.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}
          >
            {formData.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        )}

        <Box sx={{ mt: 3 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
            multiple
            onChange={handleImageUpload}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
            >
              Add Images
            </Button>
          </label>
        </Box>

        {previewUrls.length > 0 && (
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {previewUrls.map((url, index) => (
              <Box key={index} sx={{ position: "relative" }}>
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    bgcolor: "background.paper",
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Create Post
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePost;
