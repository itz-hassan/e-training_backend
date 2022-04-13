const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseRateSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    student: { type: Schema.Types.ObjectId, ref: "User" },
    courseRate: {
      type: Number,
      required: true,
    },
    feedback: { type: String },
    suggestion: { type: String },
    date: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = CourseRate = mongoose.model("courseRate", CourseRateSchema);
