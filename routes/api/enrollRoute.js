let express = require("express");
let router = express.Router();
const { initializePay, verifyPayment } = require("./paystack");

let EnrollModel = require("../../models/enrollment.model");

router.get("/verifyPay", async (req, res) => {
  if (!req.query.reference) return res.status(400).send("no refernce");
  const result = await verifyPayment(req.query.reference);
  res.send(result);
});

router.post("/add", (req, res) => {
  if (!req.body) {
    return res.status(400).send("request body is missing");
  }

  const newEnrollement = new EnrollModel({
    student: req.body.student,
    course: req.body.course,
    approved: req.body.approved,
  });

  newEnrollement
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

router.get("/enrollments", (req, res) => {
  EnrollModel.find()
    .populate({
      path: "student",
      model: "User",
      select: ["role", "email", "first_name", "last_name", "name"],
    })
    .populate({ path: "course", model: "courses" })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      logger.log(err);
      res.status(400).send(err);
    });
});

router.get("/enrollmentbystudent", (req, res) => {
  EnrollModel.find({
    student: req.query.id,
  })
    .populate({ path: "course", model: "courses" })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/checkenrollment", (req, res) => {
  EnrollModel.findOne({
    student: req.query.id,
    course: req.query.courseid,
  })
    .populate({ path: "course", model: "courses", select: "courseName" })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post("/enrollbystudent/add", (req, res) => {
  //req.body
  if (!req.body) {
    return res.status(400).send("request body is missing");
  }

  let model = new EnrollModel(req.body);
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

router.delete("/enrollment", (req, res) => {
  //var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  EnrollModel.findOneAndRemove({
    _id: req.query.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
