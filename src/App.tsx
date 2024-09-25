import { useEffect, useReducer, useState } from 'react';
import './App.css';
import { reducer } from './reducer';
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
      It seems like we have a {'\\(\\frac{1}{2}\\)'} probability of winning now with switching or not switching, but this is wrong. We can use Bayes' theorem to properly update our beliefs
      with the new information we've observed.
      </p>

      <p>
        Let's say we guess the first door. This doesn't effect the probabilities, it just helps us keep the explanation simple. Next, in the case of 3 doors,
        one door gets revealed and the other remains hidden. Let's say the revealed door is the second door. Again, this doesn't effect the probabilities. We'll denote this information as {'\\(E\\)'}.
      </p>

      <p>
        What we want to know is the probability that the prize is behind the first door given the new information that the second door doesn't have the prize, which we'll write as
        {'\\[P\\left(H_1 \\;\\middle|\\; E\\right)\\]'}
        Where {'\\(H_1\\)'} means the prize is behind door 1.
      </p>

      <p>
        According to Bayes' theorem,
        {'\\[P\\left(H_1 \\;\\middle|\\; E\\right) = \\frac{P\\left(E \\;\\middle|\\; H_1\\right) P(H_1)}{P(E)}\\]'}
      </p>

      <p>
        In the numerator, we have {'\\(P\\left(E \\;\\middle|\\; H_1\\right)\\)'}, which is the probability of door 2 being revealed, given that the prize is behind door 1.
        Remember, if the prize is behind door 1, then another door is chosen randomly to be revealed. Since there are two other doors to choose from, this probability is {'\\(\\frac{1}{2}\\)'}.
      </p>

      <p>We also have {'\\(P(H_1)\\)'}, the probability that the prize is behind the first door, which is {'\\(\\frac{1}{3}\\)'}</p>

      <p>
        {'\\(P(E)\\)'} is the probability of the second door being revealed. For this, we'll need to use the law of total probability, enumerating over each possible scenario.
        There are three scenarios: The prize is behind door 1 ({'\\(H_1\\)'}), the prize is behind door 2 ({'\\(H_2\\)'}), or it's behind door 3 ({'\\(H_3\\)'}). This means
        {'\\[P(E) = P\\left(E \\;\\middle|\\; H_1\\right) P(H_1) + P\\left(E \\;\\middle|\\; H_2\\right) P(H_2) + P\\left(E \\;\\middle|\\; H_3\\right) P(H_3)\\]'}
      </p>

      <p>
        We already know that {'\\(P\\left(E \\;\\middle|\\; H_1\\right) = \\frac{1}{2}\\)'}. And if the prize was behind the second door, then the door couldn't have been revealed, so {'\\(P\\left(E \\;\\middle|\\; H_2\\right) = 0\\)'}.
        Finally, If the prize is behind the third door, then the second door would definitely have to be revealed, so {'\\(P\\left(E \\;\\middle|\\; H_3\\right) = 1\\)'}. Also, since all doors have an equal chance to have the prize, we know
        {'\\(H_1 = H_2 = H_3 = \\frac{1}{3}\\)'}.
      </p>

      <p>
        Putting it all together, we get {'\\(P(E) = \\frac{1}{2} \\cdot \\frac{1}{3} + 0 + 1 \\cdot \\frac{1}{3} = \\frac{1}{2}\\)'}.
      </p>

      <p>
        Now we can plug everything in to find our goal:
        {'\\[P\\left(H_1 \\;\\middle|\\; E\\right) = \\frac{\\frac{1}{2} \\cdot \\frac{1}{3}}{\\frac{1}{2}} = \\frac{1}{3}\\]'}
      </p>

      <p>
        That's the probability that the prize is behind the original door we guessed, given the information that the second door was revealed. Since there is only one other door to choose, the probability that it's
        behind that door is {'\\(\\frac{2}{3}\\)'}, which means you're more likely to win when you switch.
      </p>

      <p>
        But how did gaining new information not affect the probability of the prize being behind the door we guessed? It's because we learned something about the other doors, not the door we guessed.
        Revealing doors that don't contain the prize doesn't tell us anything about the door that we guessed because regardless of the correctness of our guess, a door would be opened. However, this information does allow us to refine our
        knowledge of the other doors. There is still a probability of {'\\(\\frac{2}{3}\\)'} that the prize is behind a door that we did not guess, but since all but one other door was revealed, it's as if the whole {'\\(\\frac{2}{3}\\)'} probability
        gets absorbed into the other hidden door, which is why it's so much better to switch. Try playing the game with 10 or even 100 doors. The odds of winning by switching improve even more as you increase the total number of doors.
      </p>
    </div>
  )
}

export default App;
