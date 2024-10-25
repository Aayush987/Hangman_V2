/* eslint-disable react/prop-types */
// const wordToGuess = "Armstrong";

const HangmanWord = ({isOpponent, word, reveal = false, guessedLetters}) => {
    return (
        <div className="word-container" style={{pointerEvents: isOpponent ? 'none' : 'auto'}}>
          {word?.split("").map((letter,index) => (
            <span className="letter_border" key={index}>
                <span style = {{visibility: guessedLetters.includes(letter) || reveal ? "visible": "hidden",color: !guessedLetters.includes(letter) && reveal ? "red" : "black"}}>
                    {letter}
                </span>
            </span>
          ))}   
        </div>
    )
}

export default HangmanWord;