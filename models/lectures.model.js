const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LectureSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    moduleNo: { type: Number, required: true }, //
    mediaLink: [Object], //{ type: String, required: true }, //
    // mediaLinkExt: { type: String, required: true }, //
    videoLink: [String], //
    objectives: [String], //
    contentType: { type: String, required: true }, // vid, infographic, pdf, etc...
    description: { type: String, required: true }, //
    externalLinks: [String], //
    assignments: { type: Object, required: false }, // due date, title, description, additional files
    quizes: { type: Object, required: false }, // due date, title
    tags: [String], //tags for filter regarding courses with associations
    course: { type: Schema.Types.ObjectId, ref: "Course" },

    capturedBy: { type: Schema.Types.ObjectId, ref: "User" },
    modifiedBy: [Object],
    approvedBy: String,
  },
  { timestamps: true }
);

module.exports = Lecture = mongoose.model("lectures", LectureSchema);
