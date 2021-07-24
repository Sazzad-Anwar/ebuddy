//@Description: All types of application route's configuration is set in this file
const express = require('express');
const router = express.Router();
const { uploadFile, fileDelete, saveUser } = require('../controllers/AppController');
const { upload } = require('../middlewares/multerMiddleware');

//@Description:
//ROUTE: /api/v1/home
//Access: user
router
    .route('/user')
    .post(saveUser)
    .put(saveUser);

router
    .route('/upload')
    .post(upload.array('uploads'), uploadFile)

router
    .route('/upload/:id')
    .delete(fileDelete)

module.exports = router;