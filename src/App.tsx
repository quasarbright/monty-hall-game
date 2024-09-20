import React, { useReducer, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { State, reducer } from './reducer';
import { Game } from './game';

function App() {
  const [numDoors, setNumDoors] = useState(3)
  const [state, dispatch] = useReducer(reducer, {})
  function startGame() {
    dispatch(["START", numDoors])
  }
  return (
    <div style={{padding: 20}}>
      <h1>Monty Hall</h1>
      <label htmlFor="numDoors">Number of doors </label>
      <input type='number' id='numDoors' defaultValue={3} min={3} max={100} onChange={(ev) => setNumDoors(parseInt(ev.target.value, 10))}/>
      <br/>
      <button onClick={startGame}>play</button>
      <br/>
      <Game state={state} dispatch={dispatch}/>
    </div>
  );
}

export default App;
