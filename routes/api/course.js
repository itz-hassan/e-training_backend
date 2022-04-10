let CourseModel = require("../../models/courses.model");
let express = require("express");
let router = express.Router();
const path = require("path");
const _data = require("../../lib/data");
const logger = require("../../startup/logging");

// add new course
router.post("/", async (req, res) => {
  // validating if there is req.body
  if (!req.body) {
    return res.status(400).send("Required fields missing");
  } else if (!req.files) {
    return res.status(400).send("course image missing");
  }

  const newCourse = await new CourseModel({
    courseName: req.body.courseName,
    courseCode: req.body.courseCode,
    courseDescription: req.body.courseDescription,
    courseStartDate: Date.parse(req.body.courseStartDate),
    courseEndDate: Date.parse(req.body.courseEndDate),
    cost: req.body.cost,
    class: req.body.class,
    no_of_modules: req.body.no_of_modules,
    tags: req.body.tags,
    announcements: [],
    liveSessions: [],
    instructor: req.body.instructor,
    category: req.body.category,

    capturedBy: req.body.capturedBy,
  });
  const courseDir = newCourse._id;

  // Save the media to a dir
  _data.createDir(courseDir, _data.baseDir, (err) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      // save course image to the dir
      try {
        if (req.files) {
          // change the file name
          let newFile = req.files.courseImage;
          newFile.name = "courseImage.jpeg";

          //Use the mv() method to place the file in the course directory
          const filePath = `.data/${courseDir}/${newFile.name}`;
          newFile.mv(filePath);

          // save the courseImage path in the document
          newCourse.courseImage = filePath;

          // Save the new course data
          newCourse
            .save()
            .then((doc) => res.status(200).json(doc))
            .catch((err) => {
              _data.deleteDir(`.data/${courseDir}`, () =>
                res.status(400).send("Course code is not unique, already exits")
              );
            });
        }
      } catch (err) {
        return res.status(500).send(err);
      }
    }
  });
});

//  get all
router.get("/", (req, res) => {
  CourseModel.find()
    .populate({ path: "category", model: "category", select: "categoryName" })
    .populate({
      path: "instructor",
      model: "User",
      select: ["role", "email", "first_name", "last_name"],
    })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      logger.log(err);
      res.status(400).send(err);
    });
});

//  get by category
router.get("/byCategory", (req, res) => {
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;

  CourseModel.find({
    category: req.query.category,
    status: true,
  })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate({ path: "category", model: "category", select: "categoryName" })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      logger.log(err);
      res.status(400).send(err);
    });
});

router.get("/downloadCourseImage", (req, res) => {
  const dirname = req.query.fileName;
  const mediaPath = path.join(_data.baseDirPath, dirname);

  try {
    res.sendFile(mediaPath);
  } catch (err) {
    res.json({ message: err.message });
  }
});

// find by id
router.route("/:id/").get((req, res) => {
  CourseModel.findOne({ _id: req.params.id })
    .populate({ path: "category", model: "category", select: "categoryName" })
    .populate({
      path: "instructor",
      model: "User",
      select: ["role", "email", "first_name", "last_name"],
    })
    .then((doc) => res.json(doc))
    .catch((err) => res.status(400).json("Error: " + err));
});

//get courses by instructor id
router.get("/instructor/:id/", (req, res) => {
  CourseModel.find({
    instructor: req.params.id,
  })
    .populate({ path: "category", model: "category", select: "categoryName" })
    .populate({
      path: "instructor",
      model: "User",
      select: ["role", "email", "first_name", "last_name"],
    })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// updating a course
router.put("/:id/", (req, res) => {
  CourseModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id/", (req, res) => {
  CourseModel.findOneAndRemove({
    _id: req.params.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
