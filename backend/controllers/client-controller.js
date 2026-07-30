const con = require('../utils/db');
const uniqid = require('uniqid');
const { responseMessage } = require('../utils/error');
const { verifyToken } = require('../utils/utils');
const { queueINIT } = require('../utils/redisbd');

const queue = queueINIT('email-queue');
const kiam = 'kiam';
const visitor = async (req, res) => {
  const {
    username,
    email,
    phone,
    date,
    LINK,
    token,
    method,
    selectedItems,
  } = req.body;
  const uniqId = uniqid();
  const linkPort = LINK + `review/${uniqId}`;

  try {
    const isVarify = verifyToken(token);
    const userSql =
      'SELECT company_name, phato_path, sms_message, email_message  FROM users WHERE email = ?';
    con.query(
      userSql,
      [isVarify.decoded.email],
      async (err, userRes) => {
        if (err) {
          return res.json(
            responseMessage('error', 'user not valid'),
          );
        }
        const transformedArray = selectedItems.map(item => [
          uniqId,
          item.method,
          item.username,
          item.email,
          item.phone,
          isVarify.decoded.email,
          1,
        ]);

        selectedItems.forEach(async item => {
          console.log(item);
          await queue.add(`message-queue`, {
            method: item.method,
            linkPort,
            email: item.email,
            username: item.username,
            phone: item.phone,
            phato_path: userRes[0].phato_path,
            company_name: userRes[0].company_name,
            sms_message: userRes[0].sms_message,
            email_message: userRes[0].email_message,
            unsubscribe: `${LINK}user/unsubscribe/${uniqId}`,
          });
        });

        const sql =
          'INSERT INTO client_visitor (client_id, method, name, email, number,user_email, count) VALUES ? ';
        const countV = 1;
        con.query(
          sql,
          [transformedArray],
          (err, userData) => {
            if (err) {
              return res.json(
                responseMessage(
                  'error',
                  'Data not save! please try again',
                ),
              );
            }
            return res.json(
              responseMessage(
                'success',
                'Message sent successfully',
              ),
            );
          },
        );
      },
    );
    const hasEmail =
      'SELECT * FROM client_visitor WHERE email = ?';
    // con.query(hasEmail, [email], async (err, result) => {
    //   if (err) {
    //     return res.json(responseMessage('error', 'Some Internal Problem'));
    //   }
    //   const clientSQL =
    //     'SELECT COUNT(*) as count FROM client_visitor WHERE unsubscribe = 0 AND email = ?';
    //   con.query(clientSQL, [email], async (err, clientRes) => {
    //     console.log(clientRes);
    //     if (clientRes[0].count === 1) {
    //       return res.json(
    //         responseMessage(
    //           'error',
    //           'The client has already unsubscribed your service'
    //         )
    //       );
    //     }
    //   });

    // });
  } catch (error) {
    return res.json(
      responseMessage('error', 'Internate Problem!'),
    );
  }
};

const getAllSendData = async (req, res) => {
  const token = req.headers.token;
  try {
    const isVerifyToken = verifyToken(token);
    const sql =
      'SELECT method, name, email , number, date , review_method FROM client_visitor WHERE user_email = ?';

    con.query(
      sql,
      [isVerifyToken.decoded.email],
      (err, result) => {
        if (err) {
          return res.json(responseMessage('error', 'ok'));
        }
        return res.json(
          responseMessage('success', 'ok', {
            data: result,
          }),
        );
      },
    );
  } catch (error) {
    return res.json(responseMessage('error', 'ok'));
  }
};

const getVisitor = (req, res) => {
  const { clientid } = req.headers;
  try {
    const hasClientId =
      'SELECT * FROM client_visitor WHERE client_id = ?';
    con.query(
      hasClientId,
      [clientid],
      async (err, result) => {
        if (result.length === 0) {
          return res.json(
            responseMessage('error', 'ok', {
              isSend: false,
            }),
          );
        }
        const user = 'SELECT * FROM users WHERE email = ?';
        con.query(
          user,
          [result[0].user_email],
          async (err, result_1) => {
            return res.json(
              responseMessage('success', 'ok', {
                isSend: Boolean(result[0].isSend),
                facebook_link: result_1[0].facebook_link,
                google_link: result_1[0].google_link,
                logo: result_1[0].phato_path,
              }),
            );
          },
        );
      },
    );
  } catch (error) {
    return res.json(
      responseMessage('error', 'ok', {
        isSend: false,
      }),
    );
  }
};

const methodsClickVisitor = (req, res) => {
  const { clientId, item, dateData } = req.body;
  try {
    const hasClientId =
      'SELECT * FROM client_visitor  WHERE client_id = ?';
    console.log(clientId);
    con.query(
      hasClientId,
      [clientId],
      async (err, result) => {
        if (result.length === 0) {
          return res.json(responseMessage('error', 'ok'));
        }
        const user =
          'UPDATE client_visitor SET review_method = ?, date = ?, isSend = ?  WHERE email = ?';
        con.query(
          user,
          [item, dateData, true, result[0].email],
          async (errd, result) => {
            console.log('ok');
          },
        );
      },
    );
  } catch (error) {}
};
const unsubscribe = (req, res) => {
  try {
    const { id, isUnsubscribe } = req.body;
    console.log(id, isUnsubscribe);
    const sql =
      'UPDATE client_visitor SET unsubscribe = ? WHERE client_id = ? ';
    con.query(
      sql,
      [isUnsubscribe, id],
      async (err, result) => {
        return res.json(
          responseMessage('success', 'success'),
        );
      },
    );
  } catch (error) {
    res.json(responseMessage('error', 'server error'));
  }
};

// QR code add and get
const qr_code_get = async (req, res) => {
  try {
    const { authorization, link } = req.headers;
    const token = authorization.split(' ')[1];
    const isVerify = verifyToken(token);
    const sql =
      'SELECT * FROM qr_code  WHERE user_email = ? AND valid = ?';
    const [visitor] = await con.query(sql, [
      isVerify.decoded.email,
      1,
    ]);

    if (visitor.length === 0) {
      return res.json(
        responseMessage('success', {
          id: 'none',
          valid: false,
        }),
      );
    }

    return res.json(
      responseMessage(
        'success',
        'visitor get successfully',
        visitor,
      ),
    );
  } catch (error) {
    res.json(
      responseMessage('error', 'Internal Server Error'),
    );
  }
};

const qr_code_gen = async (req, res) => {
  try {
    const { authorization } = req.headers;
    const { user } = req.body;

    // 1. Guard clause: Ensure Authorization header exists
    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      return res
        .status(401)
        .json(
          responseMessage(
            'error',
            'Unauthorized: Token missing',
          ),
        );
    }

    const token = authorization.split(' ')[1];
    const isVerify = verifyToken(token);

    // 2. Guard clause: Ensure token was successfully verified
    if (!isVerify?.decoded?.email) {
      return res
        .status(401)
        .json(
          responseMessage(
            'error',
            'Unauthorized: Invalid token',
          ),
        );
    }

    const uniqId = uniqid();

    // 3. Match SQL columns with array values in exact order
    // Note: Ensure column names match your DB schema (e.g., company_name vs compnay_name)
    const sql = `
      INSERT INTO qr_code (
        unique_id, 
        user_email, 
        facebook_link, 
        google_link, 
        company_logo,
        company_name
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [visitor] = await con.query(sql, [
      uniqId,
      isVerify.decoded.email,
      user.facebook_link || '', // Facebook
      user.google_link || '', // Google
      user.company_logo || '', // Company Logo
      user.company_name || '', // Company Name
    ]);

    return res.status(200).json(
      responseMessage('success', {
        id: `${visitor.facebook_link}user/open-review/${uniqId}`,
        valid: true,
      }),
    );
  } catch (error) {
    console.error('Error generating QR code:', error); // Log the actual error for debugging
    return res
      .status(500)
      .json(
        responseMessage('error', 'Internal Server Error'),
      );
  }
};
const qr_code_delete = (req, res) => {
  const { token } = req.headers;
  const link = req.body.LINK;
  const isVerify = verifyToken(token);
  try {
    const deleteSql =
      'UPDATE qr_code SET valid = ? WHERE user_email = ?';
    con.query(
      deleteSql,
      [false, isVerify.decoded.email],
      (err, clientData) => {
        if (err) {
          return res.json(
            responseMessage(
              'error',
              'Internal Server Error',
            ),
          );
        }
        res.json(
          responseMessage('success', {
            id: 'dfdfgd',
            valid: false,
          }),
        );
      },
    );
  } catch (error) {
    res.json(
      responseMessage('error', 'Internal Server Error'),
    );
  }
};

module.exports = {
  visitor,
  getVisitor,
  getAllSendData,
  methodsClickVisitor,
  unsubscribe,
  qr_code_get,
  qr_code_gen,
  qr_code_delete,
};
