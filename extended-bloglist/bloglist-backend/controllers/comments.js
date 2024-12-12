const express = require("express");
const Comment = require("../models/comment");
const Blog = require("../models/blog");
const commentsRouter = express.Router();
const middleware = require("../utils/middleware");

commentsRouter.post(
  "/:id/comments",
  middleware.tokenExtractor,
  async (req, res) => {
    const { content } = req.body;
    const blogId = req.params.id;

    // Check if content exists
    if (!content) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    try {
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }

      const comment = new Comment({
        content,
        blog: blogId,
      });

      const savedComment = await comment.save();

      blog.comments.push(savedComment._id);
      await blog.save();

      const commentResponse = {
        ...savedComment.toJSON(),
        blogTitle: blog.title,
        blogUrl: blog.url,
      };

      res.status(201).json(commentResponse);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Failed to add comment" });
    }
  }
);

commentsRouter.get("/:id/comments", async (req, res) => {
  const blogId = req.params.id;
  console.log(blogId, "Blog ID comments");

  try {
    const blog = await Blog.findById(blogId).populate("comments");
    console.log(blog.comments);
    if (!blog) {
      console.log(blog.comments);
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

module.exports = commentsRouter;
