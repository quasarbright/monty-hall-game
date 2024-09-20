export interface State {
  doors?: boolean[] // true if prize
  guess?: number // index of initial guess
  other?: number // index of other hidden door
  swapped?: boolean
}

export function isWin(state: State) {
  return state.swapped ? state.doors?.[state.other!] : state.doors![state.guess!]
}

export type Action = ["START", number] // numDoors
                   | ["GUESS", number] // guessIdx
                   | ["REVEAL_OTHERS"]
                   | ["SWAP", boolean] // shouldSwap

export function reducer(state: State, action: Action): State {
  const [actionType, actionPayload] = action
  switch (actionType) {
    case "START":
      const numDoors = actionPayload
      const doors = Array(numDoors).fill(false)
      const idx = Math.floor(Math.random() * numDoors)
      doors[idx] = true
      return {doors}
    case "GUESS":
      return {...state, guess: actionPayload}
    case "REVEAL_OTHERS":
      // find index of hidden non-prize
      let other = 0
      if (state.doors![state.guess!]) {
        do {
          other = Math.floor(Math.random() * state.doors!.length)
        } while (other === state.guess)
      } else {
        other = state.doors!.findIndex(isPrize => isPrize)
      }
      return {...state, other}
    case "SWAP":
      return {...state, swapped: actionPayload}
  }
}
