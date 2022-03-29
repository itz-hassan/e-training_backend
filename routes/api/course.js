let CourseModel = require("../../models/courses.model");
let express = require("express");
let router = express.Router();

// add new record
router.post("/", (req, res) => {
  // validating if there is req.body

  if (!req.body) {
    return res.status(400).json("request body is missing");
  }

  const newCourse = new CourseModel({
    courseName: req.body.courseName,
    courseCode: req.body.courseCode,
    courseDescription: req.body.courseDescription,
    courseStartDate: Date.parse(req.body.courseStartDate),
    courseEndDate: Date.parse(req.body.courseEndDate),
    cost: req.body.cost,
    class: req.body.class,
    no_of_modules: req.body.no_of_modules,
    announcements: [],
    liveSessions: [],
    instructor: req.body.instructor,
    category: req.body.category,

    capturedBy: req.body.capturedBy,
  });

  newCourse
    .save()
    .then((doc) => res.status(200).json(doc))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//  get all
router.get("/", (req, res) => {
  CourseModel.find()
    .populate({ path: "category", model: "category", select: "categoryName" })
    .populate({
      path: "instructor",
      model: "users",
      select: ["role", "email", "first_name", "last_name"],
    })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// find by id
router.route("/:id/").get((req, res) => {
  CourseModel.findOne({ _id: req.params.id })
    .populate({ path: "category", model: "category", select: "categoryName" })
    .populate({
      path: "instructor",
      model: "users",
      select: ["role", "email", "first_name", "last_name"],
    })
    // .exec((err, doc) => {
    //   if (err) return res.status(400).json("Error: " + err);
    //   res.json(doc);
    // });
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
      model: "users",
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
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  CourseModel.findOneAndUpdate(
    {
      _id: req.query.id,
    },
    req.body,
    {
      new: true,
    }
  )
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
