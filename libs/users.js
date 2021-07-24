const User = require('../models/users')

const joinUsers = async (id, email, photo) => {

    await User.updateOne(
        { email },
        {
            $set: {
                socketId: id,
                photo: photo ?? '',
                isActive: true
            }
        }
    )
    return await User.findOne({ email });
}

const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
};

const userLeave = async id => {
    let user = await User.findOne({ socketId: id });
    if (user) {
        await User.updateOne({ _id: user.id }, { $set: { isActive: false } });
        return user
    }
}

const getRoomUser = async email => {
    return await User.findOne({ email });
}

const getAllUser = async () => {
    return await User.find();
}

module.exports = {
    joinUsers, getCurrentUser, userLeave, getRoomUser, getAllUser
}