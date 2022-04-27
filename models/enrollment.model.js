const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new mongoose.Schema({
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["paid"],
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
});

const EnrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    assignments: [Object], // due date, title, description, additional files
    quizes: [Object], //
    grading: [Object], // for all the grading
    progress: { type: Number, default: 0 }, // for the students progress
    modules: [Object], // for the students progress, to know the module the user stopped
    // module: { type: Number, default: 1 }, // for the students progress, to know the module the user stopped
    certification: { type: Object }, // for the students certification
    licence: { type: Object }, // for the students licence
    approved: {
      type: PaymentSchema,
    },
  },
  { timestamps: true }
);

module.exports = Enrollment = mongoose.model("enrollments", EnrollmentSchema);
