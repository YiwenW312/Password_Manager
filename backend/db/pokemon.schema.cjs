const Schema = require('mongoose').Schema;

module.exports = new Schema({
    name: {
        type: String,
        required: true,
    },
    color: String,
    owner: String,
    created: {
        type: Date,
        default: Date.now
    } 
}, { collection : 'pokemonSpr2024' });