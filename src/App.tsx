import React, { useEffect, useReducer, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { State, reducer } from './reducer';
import { Game } from './game';
import { MathJax } from 'better-react-mathjax';

function App() {
  const [numDoors, setNumDoors] = useState(3)
  const [state, dispatch] = useReducer(reducer, {})
  const [showMath, setShowMath] = useState(false)
  function startGame() {
    if (numDoors >= 3) {
      dispatch(["START", numDoors])
    } else {
      alert('Number of doors must be at least 3')
    }
  }
  useEffect(() => {}, [numDoors])
  return (
    <div style={{padding: 20}}>
      <h1>Monty Hall</h1>
      <label htmlFor="numDoors">Number of doors </label>
      <input type='number' id='numDoors' defaultValue={3} min={3} max={100} onChange={(ev) => setNumDoors(parseInt(ev.target.value, 10))}/>
      <br/>
      <button onClick={startGame}>play</button>
      <br/>
      <Game state={state} dispatch={dispatch}/>
      <br/>
      <br/>
      <button onClick={() => setShowMath(b => !b)}>{showMath ? 'hide math' : 'show math'}</button>
      {showMath && <Math key={numDoors} numDoors={numDoors}/>}
    </div>
  );
}

const Math = ({numDoors}: {numDoors: number}) => {
  const pSwitch = `\\(\\frac{${numDoors - 1}}{${numDoors}}\\)`
  const PSwitch = () => <MathJax>{pSwitch}</MathJax>
  const pNoSwitch = `\\(\\frac{1}{${numDoors}}\\)`
  const PNoSwitch = () => <p><MathJax>{pNoSwitch}</MathJax></p>
  useEffect(() => {
    // @ts-ignore
    if (typeof window?.MathJax !== "undefined") {
      // @ts-ignore
      window.MathJax.typeset()
    }
  }, [])
  return (
    <div>
      <p>
      The game starts with us guessing which door contains the prize. Then the other doors are revealed, except for one.
      If our guess was right, then one of the other doors is randomly chosen to remain hidden. If our guess was wrong, then the door with the prize remains hidden.
      Now we have the option to switch to the other door or to stay with our original guess. Which door is more likely to have the prize?
      </p>

      <p>
      Initially, we have a {pNoSwitch} probability of guessing correctly. But now we have more information. We know that the prize is either behind our guess door or the other door.
      It seems like we have a {'\\(\\frac{1}{2}\\)'} probability of winning now with switching or not switching, but this is wrong.
      </p>

      <p>
      Let's think about the two possible scenarios: In scenario A, the prize is behind our guess and the other door got chosen randomly.
      We know that the other door is the one that got chosen, so we can consider that a given. The only unknown is whether our initial guess was correct, which has probability {pNoSwitch}. This means the probability of scenario A is {pNoSwitch}.
      </p>

      <p>
      In scenario B, the prize is behind the other door and our guess is wrong. If our guess is wrong, then the other door has to be the prize door. There is no randomness like scenario A.
      The probability of our guess being wrong is {pSwitch}.
      </p>

      <p>
      Scenario B is more likely, so we should switch.
      </p>

      <p>
      It really just comes down to whether our initial guess was correct. If it was, we should not switch. If it wasn't, we should switch. Since it's more likely that our
      guess was incorrect, we should always switch. Try playing with 100 doors. You will win almost every time by switching.
      </p>
    </div>
  )
}

export default App;
