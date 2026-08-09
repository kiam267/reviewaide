const express = require('express');
const router = express.Router();
const usresController = require('../controllers/useres-controller');
const UserValidation = require('../middlewares/userValidation-middleware');
const {
  isCheckUser,
} = require('../middlewares/checkUserValid-middleware');
const multer = require('multer');

router.route('/').post(usresController.login);
router
  .route('/forget-password')
  .get(usresController.forgetPassword);
router
  .route('/reset-password')
  .get(usresController.resetPassword);
router
  .route('/post-reset-password')
  .post(usresController.postRestPassword);

// img storage confing
// Multer configuration
let imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file, req.body);
    callback(null, './uploads');
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}`);
  },
});

// img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(null, Error('only image is allowd'));
  }
};

let upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

router
  .route('/sign-up')
  .get(isCheckUser, usresController.getSingleUser)
  .post(usresController.create);

router.route('/login').post(usresController.login);
// User
/**
 *
 */
router
  .route('/')
  .get(isCheckUser, usresController.getDashboadData)
  .put(usresController.updateUserProfile);

router.get('/header', usresController.getHeader);
router.get('/profile', usresController.getProfile);
router
  .route('/mini-update')
  .get(isCheckUser, usresController.miniUpdateGet);
router
  .route('/update')
  .put(
    isCheckUser,
    upload.single('imageURL'),
    usresController.update,
  );

module.exports = router;
