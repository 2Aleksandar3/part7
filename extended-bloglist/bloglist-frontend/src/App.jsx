import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/notification';
import BlogForm from './components/BlogForm';
import { useUser } from './context/UserContext';
import UsersView from './components/UsersView';
import UserView from './components/UserView';
import BlogView from './components/BlogView';
import {
  Container,
  createTheme,
  ThemeProvider,
  Button,
  Box,
  Typography,
  TextField,
  AppBar,
  Toolbar,
} from '@mui/material';

const App = () => {
  const { state, setUser, logoutUser, setError } = useUser();
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [newBlogVisible, setNewBlogVisible] = useState(false);

  const theme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    },
  });

  // Fetch all blogs on initial render
  useEffect(() => {
    blogService.getAll().then((blogs) => {
      console.log('Fetched blogs:', blogs);
      setBlogs(blogs);
    });
  }, []);

  // Check for a logged-in user on page load
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // Function to show notifications
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 5000);
  };

  // Handle login functionality
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setError('Wrong credentials');
      showNotification('Wrong credentials', 'error');
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  // Handle logout functionality
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    blogService.setToken(null);
    logoutUser(); // Dispatch to context
  };

  // Handle adding a new blog
  const addBlog = async ({ title, author, url }) => {
    try {
      const newBlog = { title, author, url, user: state.user.id };
      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));
      showNotification('Blog added successfully', 'success');
    } catch (exception) {
      setError('Error adding blog');
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };
    setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
    try {
      const returnedBlog = await blogService.update(updatedBlog);
      setBlogs(blogs.map((b) => (b.id === returnedBlog.id ? returnedBlog : b)));
      showNotification('Blog liked successfully', 'success');
    } catch (exception) {
      setError('Error liking blog');
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleDelete = async (blog) => {
    try {
      await blogService.deleteBlog(blog.id);
      setBlogs(blogs.filter((b) => b.id !== blog.id));
      showNotification(`Blog "${blog.title}" deleted successfully`, 'success');
    } catch (exception) {
      setError('Error deleting blog');
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  // Render form to add a new blog
  const newBlogForm = () => {
    const hideWhenVisible = { display: newBlogVisible ? 'none' : '' };
    const showWhenVisible = { display: newBlogVisible ? '' : 'none' };
    return (
      <Box>
        <Typography variant="h5">Add New Blog</Typography>
        <div style={hideWhenVisible}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setNewBlogVisible(true)}
          >
            Add Blog
          </Button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm addBlog={addBlog} showNotification={showNotification} />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setNewBlogVisible(false)}
          >
            Cancel
          </Button>
        </div>
      </Box>
    );
  };

  // If no user is logged in, show the login form
  if (!state.user) {
    return (
      <Container>
        <Notification message={notification.message} type={notification.type} />
        <Box>
          <Typography variant="h5">Log in to application</Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Log in
            </Button>
          </form>
        </Box>
      </Container>
    );
  }

  // If user is logged in, show the blogs
  return (
    <Container>
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            <AppBar position="sticky">
              <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Blog Application
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Log out
                </Button>
              </Toolbar>
            </AppBar>
            <Box mt={2}>
              <Notification
                message={notification.message}
                type={notification.type}
              />
              <Typography variant="h4">Blogs</Typography>
              <Typography variant="subtitle1">
                {state.user.name} logged in
              </Typography>
              <Box mt={2} mb={2}>
                <Link to="/users" style={{ marginRight: 10 }}>
                  <Button variant="outlined" color="primary">
                    Users View
                  </Button>
                </Link>
                <Link to="/" style={{ marginRight: 10 }}>
                  <Button variant="outlined" color="primary">
                    Blog View
                  </Button>
                </Link>
              </Box>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      {newBlogForm()}
                      {blogs
                        .sort((a, b) => b.likes - a.likes)
                        .map((blog) => (
                          <Box key={blog.id} mb={2}>
                            <Link to={`/blogs/${blog.id}`}>
                              <Blog
                                blog={blog}
                                handleLike={handleLike}
                                handleDelete={handleDelete}
                                user={state.user}
                              />
                            </Link>
                          </Box>
                        ))}
                    </>
                  }
                />

                <Route path="/users" element={<UsersView />} />

                <Route path="/users/:userId" element={<UserView />} />

                <Route
                  path="/blogs/:id"
                  element={<BlogView handleLike={handleLike} />}
                />
              </Routes>
            </Box>
          </div>
        </Router>
      </ThemeProvider>
    </Container>
  );
};

export default App;
