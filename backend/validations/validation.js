const { ZodError } = require('zod');
const { errorMessage } = require('../utils/message.js');

const validation = schema => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return errorMessage(
        res,
        400,
        'Validation Error',
        err.errors,
      );
    }

    return errorMessage(res, 500, 'Internal Server Error');
  }
};

module.exports = validation;
