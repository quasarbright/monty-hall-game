import React, { useState } from "react"
import { Action, State, isWin } from "./reducer"

interface Door {
  prize: boolean
  revealed: boolean
}

const containerStyle: React.CSSProperties = {display: 'flex', flexWrap: 'wrap', width: 400}
const doorStyle: React.CSSProperties = {marginLeft: 10, borderStyle: 'solid', fontFamily: 'monospace'}
const guessedStyle: React.CSSProperties = {borderColor: 'blue', color: 'blue'}
const otherStyle: React.CSSProperties = {borderColor: 'green', color: 'green'}

export const Game = ({state, dispatch}: {state: State, dispatch: React.Dispatch<Action>}) => {
  if (!state.doors) {
    return <div></div>
  } else if (state.guess === undefined) {
    return (
      <div>
        <p>There is a prize behind only one door. Click which door you think has the prize</p>
        <br/>
        <div style={containerStyle}>
          {state.doors!.map((_, idx) => <p style={doorStyle} key={idx} onClick={() => dispatch(["GUESS", idx])}>?</p>)}
        </div>
      </div>
    )
  } else if (state.other === undefined) {
    return (
      <div>
        <p>The door you guessed may or may not have the prize behind it</p>
        <br/>
        <div style={containerStyle}>
          {state.doors!.map((_, idx) => <p style={{...doorStyle, ...(idx === state.guess ? guessedStyle : {})}} key={idx}>?</p>)}
        </div>
        <br/>
        <p>I can reveal every other door for you except for one</p>
        <br/>
        <button onClick={() => dispatch(["REVEAL_OTHERS"])}>reveal other doors</button>
      </div>
    )
  } else if (state.swapped === undefined) {
    return (
      <div>
        <p>The prize is either behind the door you guessed, or the other door.
          Would you like to switch your guess to the other door?
        </p>
        <br/>
        <div style={containerStyle}>
          {state.doors!.map((_, idx) => 
          <p style={{...doorStyle, ...(idx === state.guess ? guessedStyle : idx === state.other ? otherStyle : {})}} key={idx}>
            {idx === state.guess || idx === state.other
              ? '?'
              : '_'}
          </p>)}
        </div>
        <br/>
        <button onClick={() => dispatch(["SWAP", true])}>switch</button>
        <br/>
        <button onClick={() => dispatch(["SWAP", false])}>don't switch</button>
      </div>
    )
  } else {
    return (
      <div>
        <p>{isWin(state) ? "You won the prize!" : "You lost"}</p>
        <br/>
        <div style={containerStyle}>
          {state.doors!.map((isPrize, idx) => 
          <p style={{...doorStyle, ...(idx === state.guess ? guessedStyle : idx === state.other ? otherStyle : {})}} key={idx}>
            {isPrize ? '$' : '_'}</p>)}
        </div>
      </div>
    )
  }
}