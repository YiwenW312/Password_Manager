const cookieHelper = require('./cookie.helper.cjs');

const express = require('express');
const router = express.Router();
const PokemonModel = require('./db/pokemon.model.cjs')

let pokemonColors = [
    {name: "pikachu", color: "yellow"},
    {name: "charizard", color: "red"},
];

// /api/pokemon/
router.post('/', async function(req, res) {
    const requestBody = req.body;
    const username = cookieHelper.cookieDecryptor(req);

    if(!username) {
        res.status(401);
        return res.send("You need to be logged in to create a pokemon!")
    }

    if(!requestBody.name || !requestBody.color) {
        res.status(401);
        return res.send("Please insert valid Pokemon Name and Color!")
    }

    const newPokemon = {
        name: requestBody.name,
        color: requestBody.color,
        owner: username,
    }

    // console.log(newPokemon);

    try {
        const response = await PokemonModel.insertPokemon(newPokemon);
        res.cookie('pokemonOwner', 'yuchen');
        res.cookie('favoriteColor', 'yellow');
        return res.send(response);
    } catch (error) {
        res.status(400);
        return res.send(error);
    }

})


// /api/pokemon/pikachu
// --> pkId => pikachu
router.put('/:pkId', async function(req, res) {
    const pokemonId = req.params.pkId;
    const pokemonData = req.body;
    const owner = cookieHelper.cookieDecryptor(req);

    if(!owner) {
        res.status(401);
        return res.send("You need to be logged in to create a pokemon!")
    }

    if (!pokemonData.name || !pokemonData.color) {
        res.status(400);
        return res.send("You need to include the pokemon name and color in your request");
    }

    try {
        // verify that this pokemon is owned by this user
        const getPokemonResponse = await PokemonModel.getPokemonById(pokemonId);
        if(getPokemonResponse !== null && getPokemonResponse.owner !== owner) {
            res.status(400);
            return res.send("You do not own this Pokemon!");
        }

        const pokemonUpdateResponse = await PokemonModel.updatePokemon(pokemonId, pokemonData);
        return res.send('Successfully updated pokemon ID ' + pokemonId)
    } catch (error) {
        res.status(400);
        return res.send(error);
    }
})



// -> /pokemon/pikachu => req.params.pokemonName === pikachu
// -> /pokemon/pikachu?food=banana
router.get('/:pkId', async function(req, res) {
    const pokemonId = req.params.pkId;


    try {
        const getPokemonResponse = await PokemonModel.getPokemonById(pokemonId);
        return res.send(getPokemonResponse);
    } catch (error) {
        res.status(400);
        return res.send(error);
    }

    // res.status(404);
    // return res.send("Pokemon with name " + pokemonName + " not found :(");
})

router.delete('/:pokemonId', async function(req, res) {
    const pokemonId = req.params.pokemonId;
    const owner = cookieHelper.cookieDecryptor(req);

    if(!owner) {
        res.status(401);
        return res.send("You need to be logged in to create a pokemon!")
    }

    try {
        const getPokemonResponse = await PokemonModel.getPokemonById(pokemonId);
        if(getPokemonResponse !== null && getPokemonResponse.owner !== owner) {
            res.status(400);
            return res.send("You do not own this Pokemon!");
        }

        const deletePokemonResponse = await PokemonModel.deletePokemon(pokemonId);
        return res.send(deletePokemonResponse);
    } catch (error) {
        res.status(400);
        return res.send(error);
    }
    // pokemonColors = pokemonColors.filter(function(pokemon) {
    //     return pokemon.name !== pokemonName
    // });

    // return res.send("Success :)");
})

// localhost:8000/api/pokemon?name=pikachu
router.get('/', async function(req, res) {
    const owner = cookieHelper.cookieDecryptor(req);

    if(!owner) {
        res.status(401);
        return res.send("You need to be logged in to create a pokemon!")
    }

    // for(let i = 0; i < pokemonColors.length; i++) {
    //     const pokemonRow = pokemonColors[i];
    //     if(pokemonRow.name === pokemonName) {
    //         return res.send('The color of ' + pokemonName + " is " + pokemonRow.color);
    //     }
    // }

    try {
        const allPokemonResponse = await PokemonModel.getPokemonByOwner(owner);
        return res.send(allPokemonResponse);
    } catch (error) {
        res.status(400);
        return res.send("Error inserting Pokemon into DB :/");
    }

})


module.exports = router;