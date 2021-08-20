//@Description:Controller for main application
const asyncHandler = require('express-async-handler');
const { response, pagination, localTimeString } = require('../middlewares/middlewares');
const User = require('../models/users');
const mongoose = require('mongoose');
const Message = require('../models/messsages');
const FriendRequests = require('../models/friendRequests');
const Friends = require('../models/friends');
const fs = require('fs');
const bcrypt = require('bcryptjs');

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

        const { name, email, photo, id, password } = req.body;

        let salt = await bcrypt.genSalt(10);

        if (id) {

            let user = await User.findById({ _id: id })
            res.json({ user });

        } else {

            let userExist = await User.findOne({ email });

            if (!userExist && name && password) {

                let hashPass = await bcrypt.hash(password, salt);

                let newUser = new User({
                    socketId: '',
                    name,
                    email,
                    photo: photo ?? '',
                    isLoggedIn: true,
                    password: hashPass
                })

                await newUser.save();
                res.json({ user: newUser });
            }
            else if (userExist && password) {

                let user = await User.findOne({ email })

                let isMatched = await bcrypt.compare(password, user.password);

                let getUser = await User.findOne({ email }).populate('-password')

                if (isMatched) {
                    res.json({ user: getUser })
                } else {
                    res.status(404).json({
                        message: 'Credentials do not matched'
                    })
                }
            } else {
                res.status(404).json({
                    message: 'User is not registered'
                })
            }
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

    if (req.method === 'GET') {

        const { search } = req.query;

        let user = await User.findOne({
            $or: [
                { email: search },
                {
                    name: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        });

        if (user) {
            let userWithDetails = await FriendRequests.findOne({ user: user._id }).populate({ path: 'friends friendRequests', options: { sort: ['createdAt'] } });
            let friendList = await Friends.findOne({ user: user._id }).populate({ path: 'friends friendRequests', options: { sort: ['createdAt'] } });

            res.json({
                isSuccess: true,
                user,
                friendRequests: userWithDetails?.friendRequests,
                friends: friendList?.friends
            });
        } else {
            res.json({ isSuccess: false, user: 'User is not registered !' })
        }
    }

});


const message = asyncHandler(async (req, res) => {
    if (req.method === 'GET') {

        let { messageSeen } = req.query;

        if (messageSeen) {
            await Message.updateOne({ from: messageSeen, isSeen: false }, {
                $set: {
                    isSeen: true
                }
            })

            res.json({ message: "Updated" });
        } else {
            let messages = await Message.find();
            res.json({ messages })
        }

    }
    if (req.method === 'POST') {
        let { user, from, file, to, message, repliedOf, _id } = req.body;
        let newMessage = new Message({
            user,
            from,
            file,
            repliedOf,
            to,
            message
        })

        if (_id) {
            await Message.findByIdAndUpdate({ _id }, {
                $set: {
                    message
                }
            })

            let editedMsg = await Message.findById({ _id });
            res.json({ message: editedMsg });
        } else {

            await newMessage.save();
            res.json({ message: newMessage });
        }

    }

    if (req.method === 'PUT') {
        let { userId } = req.query;

        // let msgSeen = await 

    }

});


const addFriend = asyncHandler(async (req, res) => {

    if (req.method === 'GET') {
        let { _id } = req.query;
        let userDetails = await FriendRequests.findById(_id)
        res.json({ userDetails })
    }

    if (req.method === 'POST') {
        const { friendId, myId } = req.body;

        if (friendId !== myId) {
            let requestFound = await User.findOne({ _id: friendId }).populate('friends friendRequests');

            if (!requestFound.friendRequests.filter(friend => friend._id === myId).length) {
                res.json({
                    isSuccess: true,
                    message: 'Request has sent already'
                })
            } else {
                await User.findOneAndUpdate({ _id: friendId }, { $push: { friendRequests: myId } }, { upsert: true, new: true });

                res.json({
                    isSuccess: true,
                    message: 'Request Sent'
                })
            }


        } else {
            res.json({
                isSuccess: false,
                message: 'Can not send friend request to your ID'
            })
        }
    }

    if (req.method === 'PUT') {
        let { requestIdRemove, userId } = req.body;

        await User.findOneAndUpdate({ _id: userId }, { $pull: { friendRequests: requestIdRemove } });

        res.json({
            isSuccess: true,
            message: 'Request Removed'
        })

    }


});

const deleteMsg = asyncHandler(async (req, res) => {
    await Message.deleteMany()
    res.json({ message: 'deleted' })
})


module.exports = {
    uploadFile, fileDelete, saveUser, message, addFriend, deleteMsg
}