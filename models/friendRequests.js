const mongoose = require('mongoose');

const friendRequestSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    friendRequests: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
}, {
    timestamps: true
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;