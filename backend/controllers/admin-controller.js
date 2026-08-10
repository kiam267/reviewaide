const { responseMessage } = require('../utils/error.js');
const con = require('../utils/db');
const {
  password_hash,
  comparePassword,
  token_generator,
} = require('../utils/utils.js');
const {
  toCamelCase,
} = require('../utils/data-conveter.js');

const getTokenFromHeader = req => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  return auth.split(' ')[1];
};

const getCurrentAdmin = async (req, res) => {
  const user = req.user; // from middleware (decoded token)

  try {
    // ✅ Check admin
    const [adminRows] = await con.query(
      `SELECT * FROM admin WHERE email = ?`,
      [user.email],
    );

    if (
      !adminRows.length ||
      adminRows[0].role !== 'admin'
    ) {
      return res.json(
        responseMessage('success', 'No data', {
          data: [],
          pagination: { total: 0, page: 1, pages: 1 },
        }),
      );
    }

    // ✅ Query params
    const {
      fullName = '',
      searchUserStatus = '',
      email = '',
      companyName = '',
      phone = '',
      page = '1',
    } = req.query;

    const pageNumber = parseInt(page) || 1;
    const pageSize = 10;
    const offset = (pageNumber - 1) * pageSize;

    // ✅ Dynamic WHERE conditions
    let conditions = [];
    let values = [];

    if (fullName) {
      conditions.push(`username LIKE ?`);
      values.push(`%${fullName}%`);
    }

    if (searchUserStatus) {
      conditions.push(`user_status = ?`);
      values.push(searchUserStatus);
    }

    if (email) {
      conditions.push(`email LIKE ?`);
      values.push(`%${email}%`);
    }

    if (companyName) {
      conditions.push(`company_name LIKE ?`);
      values.push(`%${companyName}%`);
    }

    if (phone) {
      conditions.push(`phone LIKE ?`);
      values.push(`%${phone}%`);
    }

    const whereClause =
      conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    // ✅ Total count
    const [countResult] = await con.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      values,
    );

    const total = countResult[0].total;
    //        user_status,
    //   created_at
    // ✅ Fetch users
    const [users] = await con.query(
      `SELECT 
        id,
        username,
        email,
        phone,
        company_name,
        facebook_link,
        google_link
      FROM users
      ${whereClause}
      LIMIT ? OFFSET ?`,
      [...values, pageSize, offset],
    );

    const formattedUsers = toCamelCase(users);

    return res.json(
      responseMessage(
        'success',
        'Users fetched successfully',
        {
          data: formattedUsers,
          pagination: {
            total,
            page: pageNumber,
            pages: Math.ceil(total / pageSize),
          },
        },
      ),
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        responseMessage('error', 'Internal Server Error'),
      );
  }
};

const loginCurrentAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check admin exists
    const [rows] = await con.query(
      `SELECT * FROM admin WHERE email = ?`,
      [email],
    );

    if (!rows.length) {
      return res.json(
        responseMessage('error', 'Email not exist'),
      );
    }

    const admin = rows[0];

    // ✅ Compare password
    const isMatch = await comparePassword(
      password,
      admin.password,
    );

    if (!isMatch) {
      return res.json(
        responseMessage(
          'error',
          'Email and Password does not match',
        ),
      );
    }

    // ✅ Check status
    if (admin.user_status === 'deactived') {
      return res.json(
        responseMessage('error', 'Account is deactivated'),
      );
    }

    // ✅ Generate token
    const token = token_generator({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      fullName: admin.username,
    });

    return res.json(
      responseMessage('success', 'Login successful', {
        token,
      }),
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        responseMessage('error', 'Internal Server Error'),
      );
  }
};

const createCurrentAdmin = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    // ✅ Check if admin already exists
    const [rows] = await con.query(
      `SELECT id FROM admin WHERE email = ?`,
      [email],
    );

    if (rows.length) {
      return res.json(
        responseMessage('error', `${email} already exists`),
      );
    }

    // ✅ Hash password
    const hashedPassword = await password_hash(password);

    // ✅ Insert new admin
    await con.query(
      `INSERT INTO admin (email, full_name, password) VALUES (?, ?, ?)`,
      [email, fullName, hashedPassword],
    );

    return res.json(
      responseMessage(
        'success',
        'Admin created successfully',
      ),
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        responseMessage('error', 'Internal Server Error'),
      );
  }
};
const deleteClientLink = async (req, res) => {
  const user = req.user; // from auth middleware

  try {
    const { email } = req.body;

    // ✅ Optional: check admin role (recommended)
    if (!user || user.role !== 'admin') {
      return res.json(
        responseMessage('error', 'Unauthorized'),
      );
    }

    // ✅ Check user exists
    const [rows] = await con.query(
      `SELECT id FROM users WHERE email = ?`,
      [email],
    );

    if (!rows.length) {
      return res.json(
        responseMessage('error', 'User not found'),
      );
    }

    // ✅ Transaction start
    await con.beginTransaction();

    try {
      // ✅ Delete from user table
      await con.query(`DELETE FROM users WHERE email = ?`, [
        email,
      ]);

      // ✅ Delete related clients
      await con.query(
        `DELETE FROM client WHERE email = ?`,
        [email],
      );

      // ✅ Commit transaction
      await con.commit();

      return res.json(
        responseMessage(
          'success',
          'User deleted successfully',
        ),
      );
    } catch (err) {
      // ❌ Rollback if anything fails
      await con.rollback();
      throw err;
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        responseMessage('error', 'Internal Server Error'),
      );
  }
};

const updateUserViaAdmin = async (req, res) => {
  const user = req.user; // from auth middleware

  try {
    // ✅ Check admin role
    if (!user || user.role !== 'admin') {
      return res.json(
        responseMessage('error', 'Unauthorized'),
      );
    }

    const { email, ...rest } = req.body;

    // ✅ Validate input
    if (!email) {
      return res.json(
        responseMessage('error', 'Email is required'),
      );
    }

    // ✅ Check user exists
    const [rows] = await con.query(
      `SELECT id FROM users WHERE email = ?`,
      [email],
    );

    if (!rows.length) {
      return res.json(
        responseMessage('error', 'User not found'),
      );
    }

    // ✅ Dynamic update fields
    let fields = [];
    let values = [];

    if (rest.companyName) {
      fields.push(`company_name = ?`);
      values.push(rest.companyName);
    }

    if (rest.googleLink) {
      fields.push(`google_link = ?`);
      values.push(rest.googleLink);
    }

    if (rest.facebookLink) {
      fields.push(`facebook_link = ?`);
      values.push(rest.facebookLink);
    }

    if (rest.fullName) {
      fields.push(`username = ?`);
      values.push(rest.fullName);
    }

    if (rest.phone) {
      fields.push(`phone = ?`);
      values.push(rest.phone);
    }

    // ✅ Validate user status
    if (
      rest.userStatus &&
      ['active', 'pending', 'deactived'].includes(
        rest.userStatus,
      )
    ) {
      fields.push(`user_status = ?`);
      values.push(rest.userStatus);
    }

    // ❗ Nothing to update
    if (!fields.length) {
      return res.json(
        responseMessage(
          'error',
          'No valid fields to update',
        ),
      );
    }

    // ✅ Execute update
    await con.query(
      `UPDATE users SET ${fields.join(', ')} WHERE email = ?`,
      [...values, email],
    );

    return res.json(
      responseMessage(
        'success',
        'User updated successfully',
      ),
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        responseMessage('error', 'Internal Server Error'),
      );
  }
};
module.exports = {
  getCurrentAdmin,
  loginCurrentAdmin,
  createCurrentAdmin,
  deleteClientLink,
  updateUserViaAdmin,
};
