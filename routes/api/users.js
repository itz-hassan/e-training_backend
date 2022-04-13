const express = require("express");
const router = express.Router();
// const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
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

router.put("/:id", async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // const userExist = await User.findOne({ email: req.body.email });

  // if (userExist)
  //   return res.status(400).send("User with the given email already exists");

  let user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("Invalid ID");

  user.first_name = req.body.first_name;
  user.last_name = req.body.last_name;
  user.email = req.body.email;
  user = await user.save();
  res.send(user);
});

router.post("/verifyPassword/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("password");
  if (!user) return res.status(400).send("Invalid ID");

  const isValid = await bcrypt.compare(req.body.password, user.password);
  res.send(isValid);
});

router.post("/changePassword/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) return res.status(400).send("Invalid ID");
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(req.body.password, salt);
  user.password = newPassword;
  user = await user.save();
  res.send("password changed successfully");
});

function validateUpdate(values) {
  const schema = Joi.object({
    first_name: Joi.string().required().min(3).max(50),
    last_name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(3).max(50),
  });

  return schema.validate(values);
}
module.exports = router;
