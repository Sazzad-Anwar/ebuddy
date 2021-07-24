//@Description:Controller for main application
const asyncHandler = require('express-async-handler');
const { response, pagination, localTimeString } = require('../middlewares/middlewares');
const User = require('../models/users');
const fs = require('fs');

const uploadFile = asyncHandler(async (req, res) => {
    let data = [];
    let files = req.files;
    files.map((file, index) => {
        data.push({
            filePath: `/uploads/${file.filename}`,
        })
    })
    res.json(data);
})

const fileDelete = asyncHandler(async (req, res) => {
    let { id } = req.params;

    let location = (__dirname, `./public/uploads/${id}`);
    await fs.unlink(location, (err) => {
        console.log(err);
    });
    res.json({ msg: 'done' });
})

const saveUser = asyncHandler(async (req, res) => {
    if (req.method === 'POST') {
        const { name, email, photo } = req.body;
        let userExist = await User.findOne({ email });
        if (!userExist) {

            let newUser = new User({
                socketId: '', name, email, photo: photo ?? '', isLoggedIn: true
            })

            await newUser.save();
            res.json({ user: newUser });
        }
        else {
            await User.updateOne({ email }, {
                $set: {
                    name,
                    photo
                }
            })
            let user = await User.findOne({ email });
            res.json({ user });
        }
    }
    if (req.method === 'PUT') {
        const { _id, socketId, name, email, photo } = req.body;

        let updateUser = await User.findByIdAndUpdate({ _id }, {
            $set: {
                socketId, name, email, photo
            }
        })

        res.json({ user: updateUser });
    }

});

module.exports = {
    uploadFile, fileDelete, saveUser
}