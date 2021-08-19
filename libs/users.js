const User = require('../models/users');
const mongoose = require('mongoose');
const FriendRequest = require('../models/friendRequests');
const Friends = require('../models/friends');

const joinUsers = async (id, email, photo, name) => {
    let userExists = await User.findOne({ email });
    if (userExists) {
        await User.updateOne(
            { email },
            {
                $set: {
                    socketId: id,
                    photo: photo ?? userExists.photo,
                    isActive: true
                }
            }
        )
        return await User.findOne({ email });
    } else {
        let newUser = new User({
            name,
            socketId: id,
            email,
            isLoggedIn: true,
            photo: photo ?? '',
            isActive: true,
        })
        await newUser.save()
        return newUser;
    }
}

const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
};

const userLeave = async id => {
    let user = await User.findOne({ socketId: id });
    if (user) {
        await User.updateOne({ _id: user.id }, { $set: { isActive: false } });

        return await User.findOne({ socketId: id });;
    }
}

const getRoomUser = async email => {
    return await User.findOne({ email });
}

const getAllUser = async () => {
    return await User.find();
}

const friendRequestSend = async (requestReceiver, requestSender) => {
    try {
        let userInFriendRequest = await FriendRequest.findOne({ user: requestReceiver })

        let user = await User.findOne({ _id: requestSender });

        if (requestReceiver !== requestSender) {

            if (userInFriendRequest) {

                let requestFound = await FriendRequest.findOne({ user: requestReceiver })

                let friendRequest = requestFound.friendRequests.find(findUser => findUser == requestSender)

                if ((friendRequest !== null || friendRequest !== undefined) && !friendRequest) {

                    await FriendRequest.findOneAndUpdate({ user: requestReceiver }, {
                        $push: {
                            friendRequests: requestSender
                        }
                    }, { upsert: true, new: true });


                    return { requestReceiver, requestSender, message: 'Request sent', requestSenderUser: user }

                } else {

                    return { requestReceiver, requestSender, message: 'Request sent already', requestSenderUser: user, }
                }
            } else {

                let setNewRequest = new FriendRequest({

                    user: requestReceiver,

                })

                setNewRequest.friendRequests.push([mongoose.Types.ObjectId(requestSender)]);

                await setNewRequest.save();

                return { requestReceiver, requestSender, message: 'Request sent', requestSenderUser: user, }
            }
        } else {
            return { requestReceiver, requestSender, message: 'Can not send request to your id', requestSenderUser: user }
        }
    } catch (error) {
        console.log(error);
    }
}

const friendRequestDeclined = async ({ requestId, userId }) => {
    try {
        await FriendRequest.findOneAndUpdate({ user: userId }, {
            $pull: {
                friendRequests: requestId
            }
        });

        return { message: 'Request removed' };

    } catch (error) {

        console.log(error);
    }
}

const friendRequestAccepted = async ({ requestId, userId }) => {

    try {
        let friendsOfRequestedId = await Friends.findOne({ _id: requestId });
        let friendsOfUserId = await Friends.findOne({ _id: userId });

        console.log(!friendsOfRequestedId);

        await FriendRequest.findOneAndUpdate({ user: userId }, {
            $pull: {
                friendRequests: requestId
            }
        });

        const saveFriendToUserId = async () => {
            if (!friendsOfUserId) {

                let newFriend = new Friends({
                    user: userId,
                })

                newFriend.friends.push([mongoose.Types.ObjectId(requestId)]);
                await newFriend.save();
                console.log(newFriend, 'friendsOfUserId');

            } else {
                await Friends.findOneAndUpdate({ user: userId }, {
                    $push: {
                        friendRequests: requestId
                    }
                }, { upsert: true, new: true });

            }
        }

        const saveFriendToRequestUserId = async () => {
            if (!friendsOfRequestedId) {

                let newFriend = new Friends({
                    user: requestId,
                })

                newFriend.friends.push([mongoose.Types.ObjectId(userId)]);
                await newFriend.save();
                console.log(newFriend, 'friendsOfRequestedId');

            } else {
                await Friends.findOneAndUpdate({ user: requestId }, {
                    $push: {
                        friendRequests: userId
                    }
                }, { upsert: true, new: true });
            }
        }

        saveFriendToUserId();
        saveFriendToRequestUserId()
        return { requestId, userId }

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    joinUsers,
    getCurrentUser,
    userLeave,
    getRoomUser,
    getAllUser,
    friendRequestSend,
    friendRequestDeclined,
    friendRequestAccepted
}