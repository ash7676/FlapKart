const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../utils/response");

const signUp = async function (req, res, next) {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const userExists = await models.users.findOne({
      $or: [
        {
          email,
        },
        { phone },
      ],
    });
    if (userExists) {
      return errorResponse(res, "User exists already", {}, 409);
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (hashedPassword) {
      const newUser = await models.users.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
      });
      return successResponse(res, "User registered successfully", {
        user: newUser,
      });
    }
  } catch (err) {
    console.log("Error in sign up:-", err);
    next(err);
  }
};

const signIn = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const userExists = await models.users.findOne({ email });
    if (!userExists) return errorResponse(res, "user does not exist.", {}, 404);
    const hashedPassword = userExists.password;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) return errorResponse(res, "Invalid password", {}, 401);

    const token = await jwt.sign(
      { email: userExists.email,id: userExists._id.toString()
       },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESSTKN_EXPIRY }
    );
    console.log("jwt---", token);
    return successResponse(res, "user signed in successfully", {
      user: {
        email: userExists.email,
        id: userExists._id,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { signUp, signIn };
