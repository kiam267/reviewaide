const express = require('express');
const adminController = require('../controllers/admin-controller');
const {
  isCheckUser,
} = require('../middlewares/checkUserValid-middleware');

const router = express.Router();
router.post('/', adminController.loginCurrentAdmin);
router.post('/sign-up', adminController.createCurrentAdmin);
router.use(isCheckUser);
router.get('/', adminController.getCurrentAdmin);
router.delete('/', adminController.deleteClientLink);
router.put('/', adminController.updateUserViaAdmin);

module.exports = router;
