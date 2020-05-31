// ************************************************************
// Importing Modules
const router = require("express").Router();
const User = require("../model/userModel");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ************************************************************
// Validation Schema using JOI
const registerSchema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(6).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(6).required(),
});
// ************************************************************

// ************************************************************
// Routes for Authentication
router.post("/register", async (req, res) => {
  const registerValidationResult = registerSchema.validate(req.body);

  // ************************************************************
  // Hashing the Password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  // ************************************************************

  if (registerValidationResult.error == null) {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
    });

    try {
      // ************************************************************
      // Checking User in the Database
      User.findOne({ email: req.body.email }).then((existingUser) => {
        if (existingUser == null) {
          // If not present , create a user in the database
          user.save().then((user) => {
            res.render("results.ejs", { data: user });
          });
        } else {
          // If present , prompt a message for existence
          res.render("results.ejs", { data: "Already Registered" });
        }
      });
      // ************************************************************
    } catch (error) {
      res.send(error);
    }
  } else {
    res.send(registerValidationResult.error.details[0].message);
  }
});

router.post("/login", async (req, res) => {
  const loginValidationResult = loginSchema.validate(req.body);

  if (loginValidationResult.error == null) {
    try {
      // ************************************************************
      // Checking User in the Database
      User.findOne({ email: req.body.email }).then((existingUser) => {
        if (existingUser == null) {
          // If not present
          res.render("results.ejs", { data: "Email Doesn't Exists" });
        } else {
          // If present

          // ************************************************************
          // Check for correctness of Passwords (DeHashing the Password)
          bcrypt
            .compare(req.body.password, existingUser.password)
            .then((result) => {
              if (result) {
                // ************************************************************
                // Creating and Assigning Token
                const token = jwt.sign(
                  { id: existingUser._id },
                  "tokensecretstring"
                );

                // ************************************************************
                res.header(("authToken", token)).render("results.ejs", {
                  data:
                    "User Token : " +
                    token +
                    "  **Welcome Back**" +
                    existingUser.name,
                });
              } else {
                res.render("results.ejs", {
                  data: "Email/Password is Incorrect",
                });
              }
            });
          // ************************************************************
        }
      });
      // ************************************************************
    } catch (error) {
      res.send(error);
    }
  } else {
    res.render("results.ejs", {
      data: loginValidationResult.error.details[0].message,
    });
  }
});

// ************************************************************

module.exports = router;
