const { authErrorMessage } = require('../utils/error');
const uniqId = require('uniqid');
const { queueINIT } = require('../utils/redisbd');
const jwt = require('jsonwebtoken');
const {
  password_hash,
  comparePassword,
  token_generator,
  verifyToken,
} = require('../utils/utils');
const db = require('../utils/db');

const login = async (req, res) => {
  const { email, password, temporary } = req.body;
  try {
    // 1. Check user
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );
    if (rows.length === 0) {
      return res.json(
        authErrorMessage(
          'error',
          'This is not a valid email or temporary password',
        ),
      );
    }

    // 2. Compare password
    const hasPassword = await comparePassword(
      password,
      rows[0].password,
    );

    if (!hasPassword) {
      return res.json(
        authErrorMessage('error', 'Password mismatch'),
      );
    }

    // 3. Generate token
    const token = await token_generator({
      id: rows[0].id,
      email: rows[0].email,
      isAdmin: false,
    });

    // 4. Send response
    return res.json({
      token,
      email: rows[0].email,
      isValid: rows[0].isValid,
      avater: rows[0].phato_path,
      username: rows[0].username,
      msg: { name: 'success' },
    });
  } catch (error) {
    console.error(error, req.body);

    return res.json(
      authErrorMessage('error', 'Something went wrong'),
    );
  }
};

const forgetPassword = (req, res) => {
  try {
    const { email, link } = req.headers;
    const queue = queueINIT('forget-password');

    const hasEmail = 'SELECT * FROM users WHERE email = ?';
    db.query(hasEmail, [email], async (err, result) => {
      if (result.length === 0) {
        return res.json(
          authErrorMessage('error', 'Email invalid'),
        );
      }
      const payload = {
        id: result[0].id,
        uniqId: result[0].uniqId,
        email: result[0].email,
      };
      console.log(result[0].password);
      const secret =
        process.env.VERIFY_SIGNATURE + result[0].password;
      const forget_token = await jwt.sign(payload, secret, {
        expiresIn: '15m',
      });
      const reset_link = `${link}/user/reset-password/${result[0].uniqueId}/${forget_token}`;
      console.log(reset_link);
      await queue.add(`forget-password`, {
        link: reset_link,
        email: result[0].email,
      });
      console.log('work');
      res.json(
        authErrorMessage('success', 'check email', {
          valid: true,
        }),
      );
    });
  } catch (error) {
    console.log('some rror happened');
  }
};

const resetPassword = (req, res) => {
  const { id, token } = req.headers;
  try {
    console.log(id);
    const hasEmail =
      'SELECT * FROM users WHERE uniqueId = ?';
    db.query(hasEmail, [id], async (err, result) => {
      if (result === undefined) {
        return res.json(
          authErrorMessage(
            'error',
            'You  are not register',
          ),
        );
      }
      if (result.length === 0) {
        return res.json(
          authErrorMessage('error', 'Email Invalid'),
        );
      }
      const secret =
        process.env.VERIFY_SIGNATURE + result[0].password;
      try {
        let payload = jwt.verify(token, secret);
        if (!payload) {
          return res.json(
            authErrorMessage('success', 'every think ok'),
          );
        }
      } catch (error) {
        return res.json(
          authErrorMessage(
            'error',
            'You Have  Already Change Password',
            {
              valid: true,
            },
          ),
        );
      }
    });
  } catch (error) {
    console.log(error);
    // res.json(authErrorMessage('error', 'You Have  Already Change Password'));
  }
};
const postRestPassword = (req, res) => {
  const { id, password } = req.body;
  try {
    const ID = 'SELECT * FROM users WHERE uniqueId = ?';
    db.query(ID, [id], async (err, result) => {
      const sql =
        'UPDATE users SET  password = ? WHERE uniqueId = ?';
      const hashPassword = await password_hash(password);
      console.log(result[0].uniqueId);
      db.query(
        sql,
        [hashPassword, result[0].uniqueId],
        async (err, result) => {
          res.json(
            authErrorMessage('success', 'Password changed'),
          );
        },
      );
    });
  } catch (error) {
    console.log('getpasswords error');
    res.json(
      authErrorMessage(
        'error',
        'You Have  Already Change Password',
      ),
    );
  }
};

const create = async (req, res) => {
  const { email, password, date } = req.body;
  // 1. Check if user already exists
  const hasEmailQuery =
    'SELECT COUNT(*) AS count FROM users WHERE email = ?';
  await db.query(
    hasEmailQuery,
    [email],
    async (err, result) => {
      console.log('loop', result, err, result[0].count > 0);

      if (result[0].count > 0) {
        return res.json(
          authErrorMessage('error', 'Email already exists'),
        );
      }
    },
  );

  // return;
  try {
    // if (rows[0].count > 0) {
    //   return res.json(
    //     authErrorMessage('error', 'Email already exists'),
    //   );
    // }

    // 2. Hash the password
    const hash_password = await password_hash(password);

    // 3. Insert user into DB
    const insertQuery =
      'INSERT INTO users (email, password, date, fix_email) VALUES (?, ?, ?, ?)';
    await db.query(insertQuery, [
      email,
      hash_password,
      date,
      email,
    ]);

    return res.json(
      authErrorMessage(
        'success',
        'User created successfully',
      ),
    );
  } catch (error) {
    console.error(
      'Error in create user controller:',
      error,
    );
    return res.json(
      authErrorMessage('error', 'Server or Database error'),
    );
  }
};

// Update users Profile
const update = async (req, res) => {
  const {
    username,
    email,
    password,
    phone,
    companyName,
    google,
    facebook,
    temporary,
    date,
    token,
    editSms,
    editEmail,
  } = req.body;

  const { filename } = req.file;
  try {
    const isVarify = verifyToken(token);
    const hasEmail =
      'SELECT * FROM users WHERE email = (?)';
    db.query(
      hasEmail,
      [isVarify.decoded.email],
      async (err, result) => {
        if (result.length === 0) {
          return res.json(
            authErrorMessage(
              'error',
              'This is not a valid email',
            ),
          );
        }
        if (result[0].email === email) {
          return res.json(
            authErrorMessage(
              'error',
              'This email is already in the system.',
            ),
          );
        }

        // password hash
        const hashPassword = await password_hash(password);
        const sql =
          'UPDATE users SET email = ?, password = ?, username = ?, phone = ?, company_name = ?, google_link = ?, facebook_link = ?, isValid = ?, date = ?, temporaray_lock = ?, phato_path = ?,  uniqueId = ?, email_message = ? , sms_message= ?  WHERE id = ?';
        const upData = [
          email,
          hashPassword,
          username,
          phone,
          companyName,
          google,
          facebook,
          true,
          date,
          temporary,
          filename,
          uniqId(),
          editEmail,
          editSms,
          result[0].id,
        ];
        db.query(sql, upData, async (err, result) => {
          if (err) {
            return res.json(
              authErrorMessage('error', 'Could not update'),
            );
          }
          const hasEmail =
            'SELECT * FROM users WHERE email = (?)';
          db.query(
            hasEmail,
            [email],
            async (err, result) => {
              res.json({
                token: await token_generator({
                  id: result[0].id,
                  email: result[0].email,
                }),
                email: result[0].email,
                valid: true,
                isValid: result[0].isValid,
                avater: result[0].phato_path,
                username: result[0].username,
                msg: {
                  name: 'success',
                  msg: 'Successfully Update Your Profile',
                },
              });
            },
          );
        });
      },
    );
  } catch (error) {
    console.log(error);
    return res.json(
      authErrorMessage('error', 'Something went wrong'),
    );
  }
};

//get All Usres
const getUsers = async (req, res) => {
  const token = req.headers.token;
  try {
    const isVerified = await verifyToken(token);
    const isAdmin = Boolean(
      Number(isVerified.decoded.isAdmin),
    );
    if (!isAdmin) {
      return res.json(
        authErrorMessage('error', 'This problem'),
      );
    }
    const sql =
      'SELECT uniqueId, username, email, phato_path, temporaray_lock, company_name, date, phone, facebook_link, google_link FROM users';
    db.query(sql, async (err, result) => {
      if (err) {
        return res.json(
          authErrorMessage('error', 'This problem'),
        );
      }
      return res.json(
        authErrorMessage('success', 'ok', [...result]),
      );
    });
  } catch (error) {
    return res.json(
      authErrorMessage('error', 'This problem'),
    );
  }
};

// get single user
const getSingleUser = async (req, res) => {
  const token = req.headers.token;
  const isVerified = verifyToken(token);

  try {
    const hasEmail =
      'SELECT * FROM users WHERE email = (?)';
    db.query(
      hasEmail,
      [isVerified.decoded.email],
      async (err, result) => {
        if (result.length === 0) {
          return res.json(
            authErrorMessage(
              'error',
              'This is not a valid email',
            ),
          );
        }

        const sql =
          'SELECT id, email, date, isValid FROM users WHERE email = ?';
        db.query(
          sql,
          [result[0].email],
          async (err, result) => {
            if (err) {
              return res.json({
                error: 'Problem get all users',
              });
            }
            return res.json({
              email: result[0].email,
              username: result[0].username,
              id: result[0].id,
              isValid: result[0].isValid,
              valid: true,
            });
          },
        );
      },
    );
  } catch (error) {
    return res.json(
      authErrorMessage('error', 'This problem'),
    );
  }
};

// DASHBOARD DATA
const getDashboadData = async (req, res) => {
  const token = req.headers.token;
  const isVerified = verifyToken(token);

  try {
    const hasEmail =
      'SELECT name, method, review_method FROM client_visitor WHERE user_email = (?)';
    db.query(
      hasEmail,
      [isVerified.decoded.email],
      async (err, result) => {
        if (result.length === 0) {
          return res.json(
            authErrorMessage(
              'error',
              'This is not a valid email',
            ),
          );
        }
        // let email = [];
        // let sms = [];
        // let both = [];
        // result.map((user, inx) => {
        //   if (user.method === 'email') {
        //     let count = 0;
        //     email = [{ email: count++ }];
        //   } else if (user.method === 'sms') {
        //     let count = 0;
        //     sms.push( [{ sms: count++ }])
        //     console.log(count);
        //   } else if (user.method === 'both') {
        //     let count = 0;
        //     both = [{ both: count++ }];
        //   }
        // });
        return res.json(
          authErrorMessage('success', 'ok', {
            data: result,
          }),
        );
        // const methods =
        //   'SELECT COUNT(*) AS methods FROM client_visitor  WHERE user_email = ?';

        // db.query(methods, [isVerified.decoded.email], async (err, result) => {
        //   data = [...result];
        // });

        // const methods =
        //   'SELECT COUNT(*) AS methods FROM client_visitor  WHERE user_email = ?';

        // db.query(methods, [isVerified.decoded.email], async (err, result) => {
        //   data = [...result];
        // });

        // const sql = 'SELECT id, email, date, isValid FROM users WHERE email = ?';
        // db.query(sql, [result[0].email], async (err, result) => {
        //   if (err) {
        //     return res.json({ error: 'Problem get all users' });
        //   }
        //   return res.json({
        //     email: result[0].email,
        //     username: result[0].username,
        //     id: result[0].id,
        //     isValid: result[0].isValid,
        //     valid: true,
        //   });
        // });
      },
    );
  } catch (error) {
    return res.json(
      authErrorMessage('error', 'This problem'),
    );
  }
};

const miniUpdateGet = (req, res) => {
  const token = req.headers.token;
  try {
    const isVerified = verifyToken(token);

    const hasEmail =
      'SELECT username, phone, company_name, facebook_link,google_link,  sms_message, email_message , temporaray_lock FROM users WHERE email = (?)';
    db.query(
      hasEmail,
      [isVerified.decoded.email],
      async (err, result) => {
        console.log(result);
        if (result.length === 0) {
          return res.json(
            authErrorMessage('error', 'no data'),
          );
        }
        return res.json(
          authErrorMessage('success', 'no data', {
            data: result,
          }),
        );
      },
    );
  } catch (error) {
    return res.json(authErrorMessage('error', 'no data'));
  }
};
const updateUserProfile = async (req, res) => {
  const { authorization } = req.headers;
  

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  const token = authorization.split(' ')[1];

  const {
    username,
    phone,
    company_name,
    google_link,
    facebook_link,
    company_logo,
    fullName,
    editEmail,
    editSms,
    temporary,
  } = req.body;

  try {
    const isVerify = verifyToken(token);

    const updateUser = `
      UPDATE users SET 
        username = ?, 
        phone = ?, 
        company_name = ?, 
        google_link = ?, 
        facebook_link = ?, 
        sms_message = ?, 
        email_message = ?, 
        temporaray_lock = ?
      WHERE email = ?
    `;

    const [result] = await db.query(updateUser, [
      username || null,
      phone || null,
      company_name || null,
      google_link || null,
      facebook_link || null,
      // company_logo === 'undefined' ? null : company_logo,
      editSms || null,
      editEmail || null,
      temporary || null,
      isVerify.decoded.email,
    ]);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: 'Data not updated',
    });
  }
};

const getHeader = async (req, res) => {
  const { authorization } = req.headers;
  console.log(req.headers);

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const secret = process.env.VERIFY_SIGNATURE;

    let payload = jwt.verify(token, secret);

    const [[user]] = await db.query(
      'SELECT username FROM users WHERE id = ?',
      [payload.id],
    );

    return res.status(200).json({
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      tokenInvalid: true,
    });
  }
};
const getProfile = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }

  const token = authorization.split(' ')[1];

  try {
    const secret = process.env.VERIFY_SIGNATURE;

    const payload = jwt.verify(token, secret);

    const [[user]] = await db.query(
      `SELECT 
    id,
    email,
    username,
    phone,
    company_name AS companyName,
    facebook_link AS facebookLink,
    google_link AS googleLink,
    phato_path AS avatar
  FROM users 
  WHERE id = ?`,
      [payload.id],
    );

    return res.status(200).json({
      data: user,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      tokenInvalid: true,
    });
  }
};
module.exports = {
  create,
  login,
  update,
  getUsers,
  getSingleUser,
  forgetPassword,
  resetPassword,
  postRestPassword,
  getDashboadData,
  miniUpdateGet,
  updateUserProfile,
  getHeader,
  getProfile,
};
