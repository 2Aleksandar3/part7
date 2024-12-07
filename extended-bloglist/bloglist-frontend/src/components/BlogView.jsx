import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs'; // Make sure to use your service

const BlogView = ({ handleLike }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const fetchedBlog = await blogService.getById(id);
        setBlog(fetchedBlog);
        setComments(fetchedBlog.comments || []); // Set existing comments
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await blogService.addComment(blog.id, newComment);
      setComments(comments.concat(response));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const likeBlog = () => {
    if (blog) {
      handleLike(blog); // Call the like function passed from App
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
      <p>{blog.content}</p>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>{comment.text}</li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default BlogView;
