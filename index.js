require('dotenv').config();
const con = require('./utils/bd');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const authRouter = require('./routes/auth-router');
const userRouter = require('./routes/useres-router');
const clientRouter = require('./routes/client-router');
const reviewRouter = require('./routes/review-router');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/data', (req, res) => {
  const sql = 'SELECT * FROM admin';
  con.query(sql, async (err, result) => {
    res.json({ msg: 'Everything ok!', result });
  });
});

app.get('/message', async (req, res) => {
 

  console.log('Message sent: %s', info.messageId);
  // return res.json({
  //   msg : 'ok Mesage sent '
  // })
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/client', clientRouter);
app.use('/api/review', reviewRouter);

app.listen();
