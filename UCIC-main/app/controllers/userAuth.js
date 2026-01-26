const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models");
const { User } = db;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const SALT_ROUNDS = 10;

exports.signUp = async (body, dbTrans) => {
  try {
    const { name, email, password } = body;

    if (!name || !email || !password) {
      const error = new Error("Fill all details");
      error.msgCode = 'MISSING_FIELDS';
      error.status = 400;
      throw error;
    }

    const user1 = await User.findOne({ where: { email } }, { transaction: dbTrans });
    if (user1) {
      const error = new Error("User already exists");
      error.msgCode = 'USER_EXISTS';
      error.status = 400;
      throw error;
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashed }, { transaction: dbTrans });

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      msgCode: 'SIGNUP_SUCCESS',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        token
      },
      status: 201
    };
  } catch (err) {
    throw {
      msgCode: err.msgCode || 'SIGNUP_FAILED',
      data: null,
      status: err.status || 500,
      error: true
    };
  }
};

exports.login = async (body, dbTrans) => {
  try {
    const { email, password } = body;

    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.msgCode = 'MISSING_CREDENTIALS';
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email } }, { transaction: dbTrans });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.msgCode = 'INVALID_CREDENTIALS';
      error.status = 401;
      throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error("Invalid credentials");
      error.msgCode = 'INVALID_CREDENTIALS';
      error.status = 401;
      throw error;
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      msgCode: 'LOGIN_SUCCESS',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        token
      },
      status: 200
    };
  } catch (err) {
    throw {
      msgCode: err.msgCode || 'LOGIN_FAILED',
      data: null,
      status: err.status || 500,
      error: true
    };
  }
};