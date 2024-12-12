const mongoose = require("mongoose");

// Define the Comment schema
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment text is required"], // Validation to make sure content is provided
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog", // Reference to the Blog model, ensures we know which blog the comment belongs to
    required: true, // The comment must belong to a blog
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation time
  },
});

// Set virtuals and transform the document to exclude _id and __v in the response
commentSchema.set("toJSON", {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Comment", commentSchema);
