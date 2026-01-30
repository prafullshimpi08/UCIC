const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models").sequelize;
const { User } = db.models;
const response = require('../response');

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const SALT_ROUNDS = 10;

exports.signUp = async (req, res) => {
  const dbTrans = await db.transaction();
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw { msgCode: 'MISSING_FIELDS', status: 400 };
    }

    const user1 = await User.findOne({ where: { email } }, { transaction: dbTrans });
    if (user1) {
      throw { msgCode: 'USER_EXISTS', status: 400 };
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashed }, { transaction: dbTrans });

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const result = {
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
    await dbTrans.commit();
    return response.success(req, res, result, result.status);
  } catch (err) {
    if (dbTrans && !dbTrans.finished) await dbTrans.rollback();
    console.error("SIGNUP ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || 'SIGNUP_FAILED', data: err.data || null }, err.status || 500);
  }
};

exports.login = async (req, res) => {
  const dbTrans = await db.transaction();
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw { msgCode: 'MISSING_CREDENTIALS', status: 400 };
    }

    const user = await User.findOne({ where: { email } }, { transaction: dbTrans });
    if (!user) {
      throw { msgCode: 'INVALID_CREDENTIALS', status: 401 };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw { msgCode: 'INVALID_CREDENTIALS', status: 401 };
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const result = {
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
    await dbTrans.commit();
    return response.success(req, res, result, result.status);
  } catch (err) {
    if (dbTrans && !dbTrans.finished) await dbTrans.rollback();
    console.error("LOGIN ERROR >>>", err);
    return response.error(req, res, { msgCode: err.msgCode || 'LOGIN_FAILED', data: err.data || null }, err.status || 500);
  }
};