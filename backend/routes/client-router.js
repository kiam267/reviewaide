const express = require('express');
const multer = require('multer');
const router = express.Router();
const clientController = require('../controllers/client-controller');
const {
  isCheckUser,
} = require('../middlewares/checkUserValid-middleware');

const fs = require('fs');
const path = require('path');

const uploadPath = path.join(
  process.cwd(),
  '/public',
  'orgImages',
);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
let imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log(file, 'store', req.body);
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    callback(null, `image-${Date.now()}${ext}`);
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

router.route('/review').get(clientController.getVisitor);
router
  .route('/methods')
  .put(clientController.methodsClickVisitor);

router.post(
  '/private-feedback',
  clientController.createNegativeFeedback,
);
router.post(
  '/public-feedback',
  clientController.createPublicFeedback,
);
router.use(isCheckUser);

router
  .route('/private-feedback')
  .get(clientController.getAllPrivateFeedback);
router
  .route('/public-feedback')
  .get(clientController.getAllPublicFeedback);

router
  .route('/')
  .post(clientController.visitor)
  .get(clientController.getAllSendData);

router
  .route('/unsubscribe')
  .put(clientController.unsubscribe);
router
  .route('/qr_gen')
  .get(clientController.qr_code_get)
  .post(
    upload.single('companyLogo'),
    clientController.qr_code_gen,
  )
  .delete(clientController.qr_code_delete);

router
  .route('/link-logo-query')
  .get(clientController.getReviewLogo);

module.exports = router;
