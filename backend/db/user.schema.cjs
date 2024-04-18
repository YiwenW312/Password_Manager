const Schema = require('mongoose').Schema;

module.exports = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    // favoriteColor: Number, // {type: String}
    created: {
        type: Date,
        default: Date.now
    } 
}, { collection : 'userSpr2024' });