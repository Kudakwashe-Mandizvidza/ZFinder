const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Could not get the specified user.", 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs, please check your data.", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed, please try again later", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  //password hashing for securing user passwords in the backened
  let hashedPassword;
  try {
    hashedPassword = bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed, please try again", 500);
    return next(error);
  }

  //Token generation// set private-key and expiration-time
  let token;
  try{
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  }catch(err){
    const error = new HttpError('Signup failed, please try again', 500)
    return next(error);
  }
  

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed, please try again later", 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials, please try again.", 401);
    return next(error);
  }


  //comparing the entered password and the existing hashed password using bcrypt
  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, please try again.", 401);
    return next(error);
  }

  //token generation upon login
  //used the same private-key and expiration-time to create the same token
  let token;
  try{
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  }catch(err){
    const error = new HttpError('Logging in failed, please try again', 500)
    return next(error);
  }
  
  res.json({
   userId:existingUser.id,
   email: existingUser.email,
   token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
