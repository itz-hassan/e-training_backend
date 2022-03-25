const express = require("express");
const cors = require("cors");
const error = require("../middleware/error");
const course = require("../routes/api/course");
const category = require("../routes/api/category");
const enroll = require("../routes/api/enrollRoute");
const lecture = require("../routes/api/lecture");
const user = require("../routes/api/users");
const fileUpload = require("express-fileupload");

module.exports = function (app) {
  app.use(fileUpload());
  app.use(express.json());
  app.use(cors());
  app.options("*", cors());
  app.use("/api/courses", course);
  app.use("/api/categories", category);
  app.use("/api/lectures", lecture);
  app.use("/api/enroll", enroll);
  app.use("/api/users", user);

  // error handler
  app.use(error);
};
