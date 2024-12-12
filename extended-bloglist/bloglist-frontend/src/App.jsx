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

const App = () => {
  const { state, setUser, logoutUser, setError } = useUser();
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [newBlogVisible, setNewBlogVisible] = useState(false);

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
      <div>
        <h2>add new blog</h2>
        <div style={hideWhenVisible}>
          <button onClick={() => setNewBlogVisible(true)}>add blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm addBlog={addBlog} showNotification={showNotification} />
          <button onClick={() => setNewBlogVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  // If no user is logged in, show the login form
  if (!state.user) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username:
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password:
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  // If user is logged in, show the blogs
  return (
    <Router>
      <div>
        <Notification message={notification.message} type={notification.type} />
        <h2>blogs</h2>
        <p>{state.user.name} logged-in</p>
        <Link to="/users">Users View </Link>

        <Link to="/"> Blog View</Link>
        <br />
        <button onClick={handleLogout}>Log out</button>

        <Routes>
          <Route
            path="/"
            element={
              <>
                {newBlogForm()}
                {blogs
                  .sort((a, b) => b.likes - a.likes)
                  .map((blog) => (
                    <div key={blog.id}>
                      <Link to={`/blogs/${blog.id}`}>
                        <Blog
                          blog={blog}
                          handleLike={handleLike}
                          handleDelete={handleDelete}
                          user={state.user}
                        />
                      </Link>
                    </div>
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
      </div>
    </Router>
  );
};

export default App;
