const express = require("express");
const router = express.Router();
// const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Load user model for email exist checking
const _ = require("lodash");
const { User, validate, validatePay } = require("../../models/user.model");
const { initializePay, verifyPayment } = require("./paystack");

// @route  GET   api/users/
// @desc   Register users route
// @access Public

router.get("/verifyPay", async (req, res) => {
  if (!req.query.reference) return res.status(400).send("no refernce");
  const result = await verifyPayment(req.query.reference);
  res.send(result);
});

router.post("/pay", async (req, res) => {
  console.log("Paying...", req.body);
  const { error } = validatePay(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const result = await initializePay(req.body);
  if (result.status == undefined)
    return res
      .status(500)
      .send("Network Error. make sure you are connected to internet");
  res.send(result.data);
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already exists");

  const newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    levelOfEduc: req.body.levelOfEduc,
    phone: req.body.phone,
    gender: req.body.gender,
    dob: req.body.dob,
    name: `${req.body.last_name} ${req.body.first_name}`,
    address: req.body.address,
    registration: req.body.registration,
    specialization: req.body.specialization,
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  await newUser.save();
  const token = newUser.generateAuthToken();
  res.header("x-auth-token", token).send({ token });
});

module.exports = router;
