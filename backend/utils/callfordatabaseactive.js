const con = require('./db.js');
const activateQrCodes = async () => {
  const sql = `UPDATE qr_code SET valid = true WHERE valid = true`;
  await con.query(sql);
  return true;
};

module.exports = { activateQrCodes };
