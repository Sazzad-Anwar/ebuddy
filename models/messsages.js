const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    from: {
        type: String,
        required: true,
    },
    file: [
        { type: String, }
    ],
    to: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
    sendAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message