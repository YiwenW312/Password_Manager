const model = require('mongoose').model;
const UserSchema = require('./user.schema.cjs');

const UserModel = model('User', UserSchema);

function insertUser(user) {
    return UserModel.create(user);
}

function getUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}

// function getPokemonById(id) {
//     return PokemonModel.findById(id).exec();
// }

// function deletePokemon(id) {
//     return PokemonModel.deleteOne({_id: id})
// }

// function updatePokemon(id, pokemon) {
//     return PokemonModel.findOneAndUpdate({_id: id}, pokemon)
// }

// function getPokemonByOwner(owner) {
//     return PokemonModel.find({
//         owner: owner,
//     }).exec();
// }

module.exports = {
    insertUser,
    getUserByUsername,
    // updatePokemon,
    // insertPokemon, 
    // getAllPokemon,
    // getPokemonByOwner
}