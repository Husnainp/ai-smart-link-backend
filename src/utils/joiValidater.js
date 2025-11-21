export const joiValidate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.details.map((err) => err.message), // return all validation errors
      });
    }

    req.body = value; // replace with validated data (with defaults applied)
    next();
  };
};
