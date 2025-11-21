
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { signupService, loginService } from "../services/authService.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const { user, token } = await signupService({ username, email, password });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken: token,
    });
  } catch (err) {
    return next(new ApiError(400, err.message || 'Registration failed'));
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const result = await loginService({ email, password });
  if (!result) return next(new ApiError(401, 'Invalid credentials'));

  const { user, token } = result;

  return res.json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken: token,
  });
});


const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id); // req.user set by protect middleware

  if (!user) return next(new ApiError(404, 'User not found'));

  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new ApiError(401, 'No refresh token provided'));
  }

  try {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(refreshToken, secret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError(401, 'Invalid refresh token'));
    }

    const newAccessToken = user.generateAccessToken();

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired refresh token'));
  }
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: '/',
  });

  res.json({ success: true, message: "Logged out successfully" });
});

export {
  registerUser,
  loginUser,
  getMe,
  refreshAccessToken,
  logoutUser,
};