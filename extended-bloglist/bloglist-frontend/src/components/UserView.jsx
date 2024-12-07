import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/userService';

const UserView = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to store error messages

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true); // Start loading
        const userData = await userService.getById(userId); // Fetch user by ID
        setUser(userData); // Set the user data
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Error fetching user data'); // Set error state if fetch fails
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchUser();
  }, [userId]); // Refetch the user if the userId changes

  // Show loading message or error message if data isn't fetched yet
  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>User not found</div>; // Handle case where user data is not found
  }

  // Render user data once it's fetched successfully
  return (
    <div>
      <h2>{user.username}'s Blog Posts</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Likes</th>
          </tr>
        </thead>
        <tbody>
          {user.blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{blog.author}</td>
              <td>{blog.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserView;
