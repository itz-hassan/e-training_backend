const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commetSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  date: {
    type: Date,
    default: Date.now(),
  },
  likes: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    required: true,
  },
});

const DiscussionSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    student: { type: Schema.Types.ObjectId, ref: "User" },
    postDescription: {
      type: String,
      required: true,
    },
    likes: { type: Number, default: 0 },
    followers: [String],
    comments: {
      type: [commetSchema],
    },
    date: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = Discussion = mongoose.model("discussion", DiscussionSchema);
