require('dotenv').config();
const swagger = require('./swagger/swagger.js');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRouter = require('./routes/auth-router.js');
const userRouter = require('./routes/useres-router');
const clientRouter = require('./routes/client-router.js');
const reviewRouter = require('./routes/review-router');
const customerSupportRouter = require('./routes/customer-router');
const marketingRouter = require('./routes/marketing-route');
const shortcutRouter = require('./routes/shortcut-router');

const { errorMessage } = require('./utils/message.js');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.get(
  '/api/v2/test',
  /**
   * Test API endpoint
   *
   * Returns a simple message to verify that the API is running.
   *
   * @route GET /api/v2/test
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @returns {void}
   */
  function (req, res) {
    res.json({
      message: 'Review now Live',
    });
  },
);

// Swagger setup
swagger(app);

// Static files
app.use('/api/uploads', express.static('uploads'));
app.use('/public', express.static('public'));
app.use('/api/photos', express.static('photos'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/client', clientRouter);
app.use('/api/review', reviewRouter);
app.use('/api/customer', customerSupportRouter);
app.use('/api/marketing', marketingRouter);
app.use('/api/shortcut', shortcutRouter);

app.use(
  /**
   * Global error handling middleware for Express
   *
   * Catches all unhandled errors and sends a standardized response.
   *
   * @function globalErrorHandler
   * @param {Error} err - The error object thrown in the application
   * @param {import('express').Request} req - Express request object
   * @param {import('express').Response} res - Express response object
   * @param {import('express').NextFunction} next - Express next middleware function
   * @returns {void}
   */
  function globalErrorHandler(err, req, res, next) {
    // console.error(err); // optional logging

    return errorMessage(
      res,
      err.status || 500,
      err.message || 'Internal Server Error',
    );
  },
);

/**
 * Start the HTTP server
 *
 * Uses the configured PORT from environment variables or fallback.
 * Logs the local development URL once the server is ready.
 *
 * @param {number|string} port - Port from environment or default config
 * @listens port
 * @returns {void}
 */
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
