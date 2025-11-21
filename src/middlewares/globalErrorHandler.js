// middleware/errorHandler.js
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

// ==================== MongoDB Errors ====================

const handleCastErrorDB = (err) => {
  const message = { [err.path]: [`Invalid ${err.path}: ${err.value}`] };
  return [message, 400];
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const value = err.keyValue[field];
  const message = { [field]: [`The value '${value}' already exists. Please use another value.`] };
  return [message, 400];
};

const handleValidationErrorDB = (err) => {
  const fieldErrors = {};
  for (const field in err.errors) {
    const error = err.errors[field];
    if (error instanceof mongoose.Error.CastError) {
      fieldErrors[field] = [`Invalid data type. Expected ${error.kind}`];
    } else if (error instanceof mongoose.Error.ValidatorError) {
      fieldErrors[field] = [error.message];
    } else {
      fieldErrors[field] = [error.message];
    }
  }
  return [fieldErrors, 400];
};

// ==================== JWT Errors ====================

const handleJWTError = () => ["Invalid token. Please log in again!", 401];
const handleJWTExpiredError = () => ["Your token has expired! Please log in again.", 401];

// ==================== Multer Errors ====================

const handleMulterError = (err) => {
  let message = "File upload error";
  
  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      message = "File size is too large. Maximum size allowed is specified in configuration.";
      break;
    case "LIMIT_FILE_COUNT":
      message = "Too many files uploaded.";
      break;
    case "LIMIT_UNEXPECTED_FILE":
      message = `Unexpected field: ${err.field}`;
      break;
    case "LIMIT_PART_COUNT":
      message = "Too many parts in the multipart form.";
      break;
    default:
      message = err.message || "File upload error";
  }
  
  return [message, 400];
};

// ==================== Syntax & Type Errors ====================

const handleSyntaxError = (err) => {
  return ["Invalid JSON format in request body", 400];
};

const handleTypeError = (err) => {
  return [err.message || "Type error occurred", 500];
};

const handleReferenceError = (err) => {
  return [err.message || "Reference error occurred", 500];
};

// ==================== Development vs Production Error Response ====================

const sendErrorDev = (err, req, res) => {
  // API Error Response
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
      details: err.details || null
    });
  }
  
  // Rendered Website Error (if you have views)
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, req, res) => {
  // API Error Response
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    
    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥', err);
    logger.error({
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
  
  // Rendered Website Error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Please try again later.'
  });
};

// ==================== Main Error Handler ====================

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 🔍 Detailed console logging
  console.error('==================== ERROR CAUGHT ====================');
  console.error('Timestamp:', new Date().toISOString());
  console.error('Method:', req.method);
  console.error('Path:', req.path);
  console.error('Message:', err.message);
  console.error('Name:', err.name);
  console.error('Code:', err.code);
  console.error('Status Code:', err.statusCode);
  console.error('Stack:', err.stack);
  console.error('======================================================');

  // Log to file/service
  logger.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    message: err.message,
    name: err.name,
    code: err.code,
    statusCode: err.statusCode,
    stack: err.stack,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Development vs Production
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.statusCode = err.statusCode;
    error.status = err.status;

    // Handle specific error types
    if (error.name === 'CastError') {
      const [message, statusCode] = handleCastErrorDB(error);
      error = new ApiError(message, statusCode);
    }
    
    if (error.code === 11000) {
      const [message, statusCode] = handleDuplicateFieldsDB(error);
      error = new ApiError(message, statusCode);
    }
    
    if (error.name === 'ValidationError') {
      const [message, statusCode] = handleValidationErrorDB(error);
      error = new ApiError(message, statusCode);
    }
    
    if (error.name === 'JsonWebTokenError') {
      const [message, statusCode] = handleJWTError();
      error = new ApiError(message, statusCode);
    }
    
    if (error.name === 'TokenExpiredError') {
      const [message, statusCode] = handleJWTExpiredError();
      error = new ApiError(message, statusCode);
    }
    
    if (error.name === 'MulterError') {
      const [message, statusCode] = handleMulterError(error);
      error = new ApiError(message, statusCode);
    }
    
    if (error.name === 'SyntaxError' && error.type === 'entity.parse.failed') {
      const [message, statusCode] = handleSyntaxError(error);
      error = new ApiError(message, statusCode);
    }
    
    if (error.name === 'TypeError') {
      const [message, statusCode] = handleTypeError(error);
      error = new ApiError(message, statusCode);
    }
    
    if (error.name === 'ReferenceError') {
      const [message, statusCode] = handleReferenceError(error);
      error = new ApiError(message, statusCode);
    }

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;