/* eslint-disable react/prop-types */
const keys = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
]

const Keyboard = ({ activeLetter, inactiveLetters, disabled = false, addGuessedLetter }) => {
    return (
        <div className="keyboard-container">
        {keys.map(key => {
             const isActive = activeLetter.includes(key);
             const isInActive = inactiveLetters.includes(key);
             return (
                <button onClick={() => addGuessedLetter(key)} className= {`btn ${isActive ? 'active' : ''} ${isInActive ? 'inactive' : ''}`} disabled = {isActive || isInActive || disabled} key = {key}>{key}</button>
             )
        })}
        </div>
    )
}

export default Keyboard;