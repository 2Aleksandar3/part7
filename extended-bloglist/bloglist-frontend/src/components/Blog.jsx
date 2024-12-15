import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Typography, Paper } from '@mui/material';

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const likeBlog = () => {
    console.log('likeBlog', blog.title);
    handleLike(blog);
  };

  const deleteBlog = () => {
    if (window.confirm(`Delete blog "${blog.title}" by ${blog.author}?`)) {
      handleDelete(blog);
    }
  };
  /*<button onClick={toggleVisibility} className="toggle-button">
        {visible ? 'hide' : 'view'}
      </button>*/
  return (
    <Box sx={{ marginBottom: 2 }}>
      <Paper sx={{ padding: 2, border: '1px solid #ccc' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">
            {blog.title} by {blog.author}
          </Typography>
        </Box>

        {visible && (
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="body1" paragraph>
              <strong>URL:</strong>{' '}
              <a href={blog.url} target="_blank" rel="noopener noreferrer">
                {blog.url}
              </a>
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Likes:</strong> {blog.likes}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={likeBlog}
              sx={{ marginRight: 2 }}
            >
              Like
            </Button>
            {blog.user && blog.user._id === user.id && (
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteBlog}
              >
                Delete
              </Button>
            )}
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: 2 }}
            >
              <strong>Added by:</strong>{' '}
              {blog.user ? blog.user.username : 'Unknown User'}
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number,
    user: PropTypes.shape({
      username: PropTypes.string,
      _id: PropTypes.string,
    }),
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default Blog;
