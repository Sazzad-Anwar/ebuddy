const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    friends: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
}, {
    timestamps: true
});

const Friends = mongoose.model('Friends', friendSchema);

module.exports = Friends;