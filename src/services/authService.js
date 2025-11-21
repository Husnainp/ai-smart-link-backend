import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

async function signupService({ username, email, password, role = 'user' }) {
  // Prevent duplicates
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    throw new Error('User with this email or username already exists');
  }

  // Create user (password hashing handled in model pre-save hook)
  const user = await User.create({ username, email, password, role });

  const token = user.generateAccessToken();

  // Do not include password in returned user object
  if (user.password) user.password = undefined;

  return { user, token };
}

async function loginService({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) return null;
  const match = await user.matchPassword(password);
  if (!match) return null;

  const token = user.generateAccessToken();
  if (user.password) user.password = undefined;
  return { user, token };
}

export { signupService, loginService };
