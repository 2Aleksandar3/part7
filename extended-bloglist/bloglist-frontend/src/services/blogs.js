import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  console.log('token in create blog.js', token);
  const config = {
    headers: { Authorization: token },
  };
  console.log('newObject blog.js', newObject);

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(
    `${baseUrl}/${updatedBlog.id}`,
    updatedBlog,
    config,
  );
  return response.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  await axios.delete(`${baseUrl}/${id}`, config);
};

const getById = async (id) => {
  const request = axios.get(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const addComment = async (blogId, commentText) => {
  const response = await axios.post(`/api/blogs/${blogId}/comments`, {
    text: commentText,
  });
  return response.data;
};

export default {
  getAll,
  create,
  update,
  deleteBlog,
  setToken,
  getById,
  addComment,
};
