//@Description: All types of application route's configuration is set in this file
const express = require('express');
const router = express.Router();
const { uploadFile, fileDelete, saveUser, message, addFriend, deleteMsg } = require('../controllers/AppController');
const { upload } = require('../middlewares/multerMiddleware');

//@Description:
//ROUTE: /api/v1/home
//Access: user
router
    .route('/user')
    .get(saveUser)
    .post(saveUser)
    .put(saveUser);

router
    .route('/messages')
    .get(message)
    .post(message)
    .delete(deleteMsg)

router
    .route('/upload')
    .post(upload.array('uploads'), uploadFile)

router
    .route('/upload/:id')
    .delete(fileDelete)

router
    .route('/user/add')
    .get(addFriend)
    .post(addFriend)
    .put(addFriend);

module.exports = router;