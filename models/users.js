const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    socketId: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    isLoggedIn: {
        type: Boolean,
        required: true,
    },
    photo: {
        type: String,
    },
    isActive: {
        type: Boolean,
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;