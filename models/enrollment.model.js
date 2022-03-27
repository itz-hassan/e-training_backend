const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema(
  {
    no: {
      type: Number,
      default: 1,
      required: false,
    },
    student: { type: Schema.Types.ObjectId, ref: "User" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    assignments: { type: Object, required: true }, // due date, title, description, additional files
    quizes: { type: Object, required: true }, //
    grading: { type: Object }, // for all the grading
    progress: { type: Object }, // for the students progress
    certification: { type: Object }, // for the students certification
    licence: { type: Object }, // for the students licence
    approved: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = Enrollment = mongoose.model("enrollments", EnrollmentSchema);
