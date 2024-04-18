const model = require('mongoose').model;

const PokemonSchema = require('./pokemon.schema.cjs');

const PokemonModel = model('Pokemon', PokemonSchema);

function insertPokemon(pokemon) {
    return PokemonModel.create(pokemon);
}

function getAllPokemon() {
    return PokemonModel.find().exec();
}

function getPokemonById(id) {
    return PokemonModel.findById(id).exec();
}

function deletePokemon(id) {
    return PokemonModel.deleteOne({_id: id})
}

function updatePokemon(id, pokemon) {
    return PokemonModel.findOneAndUpdate({_id: id}, pokemon)
}

function getPokemonByOwner(owner) {
    return PokemonModel.find({
        owner: owner,
    }).exec();
}

module.exports = {
    getPokemonById,
    deletePokemon,
    updatePokemon,
    insertPokemon, 
    getAllPokemon,
    getPokemonByOwner
}