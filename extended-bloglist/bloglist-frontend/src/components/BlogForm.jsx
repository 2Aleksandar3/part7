import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Typography, Box } from '@mui/material';

const BlogForm = ({ addBlog, showNotification }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    addBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
    showNotification('Blog added successfully', 'success');
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom>
        Create a New Blog
      </Typography>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            label="Author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            label="URL"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          fullWidth
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
};

export default BlogForm;
