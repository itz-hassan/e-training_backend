const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseRatingsSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    feedBack: {
      studentID: { type: Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
      review: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("course_ratings", courseRatingsSchema);
