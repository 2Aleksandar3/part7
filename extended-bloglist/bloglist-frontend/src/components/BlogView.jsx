import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs';
import userService from '../services/userService';

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>By {blog.author}</p>
      <p>{blog.url}</p>
      <p>{blog.likes} likes</p>
      <button type="button" onClick={likeBlog} className="like-button">
        like
      </button>

      <p>Added by: {user.name}</p>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment.content}</li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment..."
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default BlogView;
