import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs';
import userService from '../services/userService';
import {
  Button,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';

const BlogView = ({ handleLike }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const fetchedBlog = await blogService.getById(id);
        setBlog(fetchedBlog);
        const fetchedComments = await blogService.getComments(id); // Fetch comments separately
        setComments(fetchedComments);
        const fetchedUser = await userService.getById(fetchedBlog.user);
        setUser(fetchedUser);
      } catch (error) {
        console.error('Error fetching blog and comments:', error);
      }
    };

    fetchBlogAndComments();
  }, [id]);

  const likeBlog = async () => {
    if (blog) {
      // Optimistic update: increase likes immediately
      const updatedBlog = { ...blog, likes: blog.likes };
      setBlog(updatedBlog); // Update the UI immediately

      // Call handleLike to update the backend
      try {
        await handleLike(updatedBlog);

        // After successfully liking, refetch the blog to sync frontend and backend
        const refetchedBlog = await blogService.getById(id);
        setBlog(refetchedBlog); // Update the blog state with the latest data
      } catch (error) {
        console.error('Error liking blog:', error);
        // If there's an error, revert the likes to the previous state
        setBlog(blog);
      }
    }
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!newComment) return;

    try {
      // Add a new comment
      const addedComment = await blogService.addComment(id, newComment);

      setComments(comments.concat(addedComment));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!blog) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: '600px', margin: 'auto', mt: 4 }}>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          By {blog.author}
        </Typography>
        <Typography variant="body1" paragraph>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </Typography>
        <Typography variant="body1" paragraph>
          {blog.likes} likes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={likeBlog}
          sx={{ marginBottom: 2 }}
        >
          Like
        </Button>
        <Typography variant="body2" color="textSecondary">
          Added by: {user.name}
        </Typography>

        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          <List>
            {comments.map((comment, index) => (
              <ListItem key={index}>
                <ListItemText primary={comment.content} />
              </ListItem>
            ))}
          </List>

          <form onSubmit={handleCommentSubmit}>
            <TextField
              label="Add a comment"
              value={newComment}
              onChange={handleCommentChange}
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              sx={{ marginBottom: 2 }}
            />
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={!newComment}
            >
              Add Comment
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default BlogView;
