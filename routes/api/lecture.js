const express = require("express");
const router = express.Router();
const CourseModel = require("../../models/courses.model");
// const fileUpload = require('express-fileupload');
//mongoose
const LectureModel = require("../../models/lectures.model");

/*Get videos*/
router.get("/", function (req, res) {
  LectureModel.find({
    course: req.query.id,
  })
    .populate({ path: "course", model: "courses", select: "courseDescription" })
    .then((doc) => {
      // res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
      //res.setHeader('Content-Range', 'users 0-5/5');
      res.json(doc);
      // console.log("populated doc:" + doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  // res.send('this is get route upload');
  // res.render('index', {title: 'Upload file'});
});

/* POST lectures or sections or modules etc*/
router.post("/localupload", function (req, res) {
  console.log(req.body);
  const newLecture = new LectureModel({
    title: req.body.title,
    videoLink: req.body.videoLink,
    contentType: req.body.contentType,
    description: req.body.description,
    externalLinks: req.body.externalLinks,
    tags: req.body.tags,
    course: req.body.course,

    capturedBy: req.body.capturedBy,
  });
  // console.log(req.files.file);

  if (req.files != undefined) {
    console.log(req.files.file.size);
    const imagefile = req.files.file;
    console.log(typeof imagefile.mv);
    // res.json(imagefile);
    imagefile.mv(`public/assets/videos/${req.files.file.name}`);
    if (imagefile) {
      newLecture.videoLink = "public/assets/videos/" + imagefile.name;
    }
  } else {
    console.log(newLecture.videoLink);
    newLecture.videoLink = newLecture.youtubelink;
  }

  newLecture
    .save()
    .then((doc) => res.status(200).json(doc))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/youtubeupload", (req, res) => {
  //req.body
  if (!req.body) {
    return res.status(400).send("request body is missing");
  }

  let model = new LectureModel(req.body);
  model
    .save()
    .then((doc) => {
      if (!doc || doc.length === 0) {
        return res.status(500).send(doc);
      }
      res.status(200).send(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
