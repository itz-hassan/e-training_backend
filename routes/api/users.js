const express = require("express");
const router = express.Router();
// const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Load user model for email exist checking
const _ = require("lodash");
const { User, validate } = require("../../models/user.model");

// @route  GET   api/users/
// @desc   Register users route
// @access Public

router.post("/", async (req, res) => {
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
    dob: req.body.dob,
    name: `${req.body.last_name} ${req.body.first_name}`,
    address: req.body.address,
    registration: req.body.registration,
  });

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  await newUser.save();
  const token = newUser.generateAuthToken();
  res.header("x-auth-token", token).send({ token });
});

// @route  GET   api/users/login
// @desc   Login users route => returning jwt token
// @access Public

router.post("/users/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    //check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //User Match

        //Create jt payload
        const payload = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          avatar: user.avatar,
          role: user.role,
        };
        //Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              first_name: user.first_name,
              last_name: user.last_name,
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
