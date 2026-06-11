require('dotenv').config();

const swagger = require('./swagger/swagger.js');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRouter = require('./routes/auth-router.js');
const { errorMessage } = require('./utils/message.js');

const userRouter = require('./routes/useres-router');
const clientRouter = require('./routes/client-router.js');
const reviewRouter = require('./routes/review-router');
const customerSupportRouter = require('./routes/customer-router');
const marketingRouter = require('./routes/marketing-route');
const shortcutRouter = require('./routes/shortcut-router');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

/* 
 * This function working as a global error handeler
 */


app.use(function (err, req, res, next) {
  return errorMessage(res, 500, 'Internal Server Error');
});

app.get('/api/v2/test', function (req, res) {
  res.json({
    message: 'Review now Live',
  });
});

// swagger setup
swagger(app);

// Serve static files from the 'uploads' directory
app.use('/api/uploads', express.static('uploads'));
app.use('/api/photos', express.static('photos'));

app.use('/api/v2/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/client', clientRouter);
app.use('/api/review', reviewRouter);
app.use('/api/customer', customerSupportRouter);
app.use('/api/marketing', marketingRouter);
app.use('/api/shortcut', shortcutRouter);

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
