import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

function PokemonPage() {
  const  navigate = useNavigate();

  const [pokemonListState, setPokemonListState] = useState([]);
  const [pokemonNameState, setPokemonNameState] = useState('');
  const [pokemonColorState, setPokemonColorState] = useState('');
  const [editingState, setEditingState] = useState({
    isEditing: false,
    editingPokemonId: '',
  });
  const [errorMsgState, setErrorMsgState] = useState('');
  const [username, setUsername] = useState('');

  async function getAllPokemon() {
    const response = await axios.get('/api/pokemon');
    setPokemonListState(response.data);
  }

  async function deletePokemon(pokemonId) {
    await axios.delete('/api/pokemon/' + pokemonId);
    await getAllPokemon();
  }

  async function onSubmit() {
    setErrorMsgState('')
    try {
        if(editingState.isEditing) {
          await axios.put('/api/pokemon/' + editingState.editingPokemonId, {
            name: pokemonNameState,
            color: pokemonColorState,
          });

        } else {
          await axios.post('/api/pokemon', {
            name: pokemonNameState,
            color: pokemonColorState,
          });
        }

        setPokemonColorState('');
        setPokemonNameState('');
        setEditingState({
          isEditing: false, 
          editingPokemonId: '',
        });
        await getAllPokemon();    
    } catch (error) {
        setErrorMsgState(error.response.data);
    }
  }

  function updatePokemonColor(event) {
    setPokemonColorState(event.target.value);
  }

  function updatePokemonName(event) {
    setPokemonNameState(event.target.value);
  }

  function setEditingPokemon(pokemonName, pokemonColor, pokemonId) {
    setPokemonColorState(pokemonColor);
    setPokemonNameState(pokemonName);
    setEditingState({
      isEditing: true, 
      editingPokemonId: pokemonId
  });
  }

  function onStart() {
    isLoggedIn()
      .then(() => {
        getAllPokemon()
      })
  }

  function onCancel() {
    setPokemonColorState('');
    setPokemonNameState('');
    setEditingState({
      isEditing: false, 
      editingPokemonId: '',
  });
  }


  async function logout() {
    await axios.post('/api/users/logout');
    navigate('/');
  }

  async function isLoggedIn() {
    try {
      const response = await axios.get('/api/users/loggedIn');
      const username = response.data.username;
      setUsername(username);
    } catch (e) {
      navigate('/')
    }
  }

  useEffect(onStart, []);


  const pokemonListElement = [];
  for(let i = 0; i < pokemonListState.length; i++) {
    
    pokemonListElement.push(<li>Name: {pokemonListState[i].name} 
        - Color: {pokemonListState[i].color} 
        - <button onClick={() => deletePokemon(pokemonListState[i]._id)}>Delete</button>
        - <button onClick={() => setEditingPokemon(pokemonListState[i].name, pokemonListState[i].color, pokemonListState[i]._id)}>Edit</button>
    </li>)
  }

  const inputFieldTitleText = editingState.isEditing ? "Edit Pokemon" : "Add new pokemon";

  if(!username) {
    return <div>Loading...</div>
  }

  return (
    <div>
        <div>
          <button onClick={logout}>Logout</button>
        
        </div>
        {errorMsgState && <h1>
            {errorMsgState}
        </h1>}
        Here are all your pokemon, {username}!!
        <ul>
            {pokemonListElement}
        </ul>

        <div>{inputFieldTitleText}</div>
        <div>
            <div>
                <label>Name:</label> <input value={pokemonNameState} onInput={(event) => updatePokemonName(event)}/>
            </div>
            <div>
                <label>Color:</label> <input value={pokemonColorState} onInput={(event) => updatePokemonColor(event)}/>
            </div>
            <div>
                <button onClick={() => onSubmit()}>Submit</button>
                <button onClick={() => onCancel()}>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default PokemonPage;
