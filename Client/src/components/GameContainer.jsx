    import { useState,useEffect, useCallback, useRef } from "react";
    import { useSocket } from "../Providers/SocketProvider";
    import HangmanDrawing from "./HangmanDrawing";
    import HangmanWord from "./HangmanWord";
    import Keyboard from "./Keyboard";
    import { useUserContext } from "../Providers/UserProvider";
    import words from "../data/words.json";
    import ScoreModal from "./ScoreModal";
    import { db } from "../utils/firebase";
    import { addDoc, setDoc, doc, arrayUnion } from 'firebase/firestore';
    import useSound from "use-sound";
    import mergedaudioFile from "../data/sounds/mergedaudioFile.mp3";

    const GameContainer = () => {
        const {Username,email} = useUserContext();
        const socket = useSocket();
        const [word,setWord] = useState('');
        const [sentence,setSentence] = useState('');
        const [guessedLetter, setGuessedLetter] = useState([]);
        const [timer, setTimer] = useState(30);
        const [score, setScore] = useState(0);
        const scoreRef = useRef(0);
        const opponentScoreRef = useRef(0);
        const opponentName = useRef('');
        const [opponentKeyPressed, setOpponentKeyPressed] = useState([]);
        const [opponentScore, setOpponentScore] = useState(0);
        const [opponentWord, setOpponentWord] = useState('');
        const [opponentSentence, setOpponentSentence] = useState('');
        const [gameActive, setGameActive] = useState(false);
        const [isWinner, setIsWinner] = useState(false);
        const [isLoser, setIsLoser] = useState(false);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [waitingForPlayers, setWaitingForPlayers] = useState(true);
        const gameEndedAbruptly = useRef(false);

        const [play] = useSound(mergedaudioFile, {
            sprite: {
                clock: [0,2000],
                game_over: [8000,1000],
                win:   [9200, 1000],
                lose: [ 11700, 2000],
                click: [12800, 100]
            }
        });

        const resetRound = useCallback(() => {
            setIsWinner(false);
            setIsLoser(false);
            setGuessedLetter([]);
            getRandomWordAndSentence();
            socket.emit('reset-round');

            // setOpponentKeyPressed([]);
            // setTimer(30);
        }, []);

        useEffect(() => {
             scoreRef.current = score;
        },[score]);
        useEffect(() => {
            opponentScoreRef.current = opponentScore
        },[opponentScore]);

        const getRandomWordAndSentence = useCallback(() => {
            const randomIndex = Math.floor(Math.random() * words.length);
            const randomWord = words[randomIndex];
            setWord(randomWord.word);
            setSentence(randomWord.sentence);
            socket.emit('game-details', {
            word: randomWord.word,
            sentence: randomWord.sentence,
            });
            console.log("Words sent through game-details")
        }, [socket]);


        // const getRandomWordAndSentence = () => {
        //     const randomIndex = Math.floor(Math.random() * words.length);
        //     const randomWord = words[randomIndex];
        //     setWord(randomWord.word);
        //     setSentence(randomWord.sentence);
        //     socket.emit('game-details', {
        //         word: randomWord.word,
        //         sentence: randomWord.sentence,
        //         timer: timer
        //     })
        //     // console.log(randomWord.word);
        //     // console.log(randomWord.sentence);
        // }

            const gameStart = useCallback(() => {
                setGameActive(true);
                setWaitingForPlayers(false);
                console.log("Game Started");
                    resetRound();
            }, [resetRound]);      
            
              const endGame = useCallback(async () => {
                setGameActive(false);
                const finalScore = scoreRef.current; // Your player's score
                const opponentFinalScore = opponentScoreRef.current;
                console.log(finalScore,opponentFinalScore); // Assuming you have this state for the opponent's score
            
                // Update the states based on score comparison
                if (finalScore > opponentFinalScore) {
                    setIsWinner(true);
                    setIsLoser(false);
                } else if (finalScore < opponentFinalScore) {
                    setIsWinner(false);
                    setIsLoser(true);
                } else {
                    setIsWinner(false); // Tie situation
                    setIsLoser(false);
                }
                setIsModalOpen(true);
                console.log("Game Over");
                socket.emit('game-over', { score });
                play({id: 'game_over'});
               
                if(!gameEndedAbruptly.current) {
                    console.log("Value",gameEndedAbruptly.current);
                    console.log("it has run");
                    await addGameInfo();
                    console.log(Username, "game over");
                }
            }, [gameActive, gameEndedAbruptly]);

            const addGameInfo = useCallback(async () => {
                try {
                    let result;
                    if(scoreRef.current > opponentScoreRef.current) {
                        result = 'Won';
                    }else if(scoreRef.current < opponentScoreRef.current) {
                        result = 'Lose';
                    }else {
                        result = 'Tie';
                    }
                    await setDoc(doc(db, "Users", email), {
                    games: arrayUnion({
                            opponent: opponentName.current, // Replace with actual opponent name if available
                            result: result,
                            score: scoreRef.current,
                            timestamp: new Date().toISOString()
                        })
                    }, { merge: true });
                    console.log("Game info added successfully");
                    console.log(isLoser);
                    console.log(scoreRef.current);
                } catch (error) {
                    console.error("Error adding game info: ", error);
                }
            }, [email, isWinner,isLoser, score]);

        // // const gameStart = () => {
        //     setGameActive(true);
        //     console.log("Game Started");
        //     setIsLoser(false);
        //     setIsWinner(false);
        //     setGuessedLetter([]);
        //     getRandomWordAndSentence();

        //     setTimer(30);
        //     // socket.emit('game-details', {
        //     //     word: word,
        //     //     sentence: sentence,
        //     //     timer: timer
        //     // })
        // }
        // const handleTimer = ({timer}) => {
        //     setTimer(timer);
        //     console.log("oppTimer:", timer);
        // }

        const handleOpponent = ({word, sentence,timer}) => {
            setOpponentWord(word);
            setOpponentSentence(sentence);
            console.log("Opponent Word:", word);
            console.log("Opponent Sentence:", sentence);
        }
        useEffect(() => {
            console.log("This running");
            const handleUserJoined = ({ name,Email, roomId }) => {
                console.log("This emit is caught");
                try {
                    console.log(Email);
                    if(email == Email) {
                        console.log("You Joined Room", roomId);
                    }else {
                        console.log("User", name,Email,"Joins Room", roomId);
                    }
                } catch (error) {
                    console.error("Error handling user-joined event:", error);
                }
            };
        
            socket.on('user-joined', handleUserJoined);
            socket.on('game-start', gameStart);
            socket.on('opponent-word',({word,sentence}) => {
                setOpponentWord(word);
                setOpponentSentence(sentence);
                console.log("Opponent Word:", word);
                console.log("Opponent Sentence:", sentence);
            });
            // socket.on('timer', ({timer}) => {
            //     console.log("Timer:", timer);
            //     setTimer(timer);
            // });
        
            return () => {
                socket.off('user-joined', handleUserJoined);
                socket.off('game-start', gameStart);
                socket.off('opponent-word',handleOpponent);
                // socket.off('timer', handleTimer);
            };
        }, [socket]);

        useEffect(() => {
            if (!gameActive) return;
            const handleTimerUpdate = ({timer}) => {
                setTimer(timer);
                play({id: 'clock'});
                console.log("Timer:", timer);
            }
            socket.on('timerUpdate', handleTimerUpdate);
            socket.on('gameOver', endGame);
            socket.on('userDisconnect', ({message}) => {
                alert(message);
                gameEndedAbruptly.current = true;
                endGame();
            });

            return () => {
                socket.off('timerUpdate', handleTimerUpdate);
                socket.off('gameOver', endGame);
            }
        }, [endGame, gameActive, socket]);
        const incorrectLetters = guessedLetter.filter(letters => !word.includes(letters))
        const opponentIncorrectLetters = opponentKeyPressed.filter(letters => !opponentWord.includes(letters))
        
        useEffect(() => {
            if (!gameActive || word.length === 0) return;
            
            if(incorrectLetters.length >= 6) {
                setIsLoser(true);
                play({id: 'lose'});
            }
            if(word.split("").every(letter => guessedLetter.includes(letter))) {
                setIsWinner(true);
                play({id: 'win'});
            }


        }, [gameActive, word, incorrectLetters.length, guessedLetter]);

        useEffect(() => {
            if (!gameActive) return;      
            
            if (isWinner) {
                console.log("This win is running");
                setScore((prevScore) => {
                    const newScore = prevScore + 5; // +5 for correct word
                    socket.emit('update-score', { score: newScore }); // Sync score with opponent
                    return newScore;
                });

                setTimeout(resetRound, 1500); // Reset after 1.5 seconds
            }
            
            if (isLoser) {
                setScore((prevScore) => {
                    const newScore = Math.max(prevScore - 3, 0); // -3 for losing (hangman complete)
                    socket.emit('update-score', { score: newScore }); // Sync score with opponent
                    return newScore;
                });
                setTimeout(resetRound, 1500); // Reset after 1.5 seconds
            }
            
            // if (isWinner || isLoser) {
            //     setGuessedLetter([]);
            //     // getRandomWordAndSentence();
            //     setOpponentKeyPressed([]);
            // }
        }, [isLoser, isWinner, gameActive, resetRound]);

        // const endGame = useCallback(() => {
        //     setGameActive(false);
        //     console.log("Game Over");
        //     socket.emit('game-over', { score });
        // }, [score,timer]);

        const addGuessedLetter = useCallback((letter) => {
            if (guessedLetter.includes(letter) || isLoser || isWinner) return;

            setGuessedLetter(currentLetters => [...currentLetters, letter]);
        }, [guessedLetter, isLoser, isWinner]);

        useEffect(() => {
            const handler = (e) => {
                const key = e.key.toLowerCase();

                if(key !== 'Enter') return

                e.preventDefault();
                setGuessedLetter([]);
                getRandomWordAndSentence();
            }
            document.addEventListener("keypress",handler)

            return () => {
                document.removeEventListener("keypress",handler)
            }
        },[addGuessedLetter,guessedLetter]);

        useEffect(() =>{
            const handler = (e) => {
            const key = e.key
            
        if(!gameActive) return;
        if (!key.match(/^[a-z]$/)) return;
        
        e.preventDefault()
        play({id: 'click'});
        addGuessedLetter(key);
        socket.emit('keyPressed', {name: Username ,keyPress: key});
        }
        document.addEventListener("keypress",handler)
        
        return () => {
        document.removeEventListener("keypress",handler)
        }
        },[addGuessedLetter])

        useEffect(() => {
            socket.on('opponent-keyPressed', ({name, key,keyPressed}) => {
                console.log("User", name, "pressed key", key);
                opponentName.current = name;
                setOpponentKeyPressed(prevKeyPressed => {
                    console.log("Previous opponent array:", prevKeyPressed);
                    console.log("New opponent array:", keyPressed);
                    return keyPressed;
                });

             socket.on('reset-round-keys', () => {
                setOpponentKeyPressed([]);
             })
        });


        return () => {
            socket.off('opponent-keyPressed');
            socket.off('reset-round-keys');
        }
    },[socket]);

    useEffect(() => {
        const handleOpponentScoreUpdate = ({ score }) => {
            setOpponentScore(score);
            console.log("Opponent Score:", score);
        };
        socket.on('opponent-score', handleOpponentScoreUpdate);

        return () => {
            socket.off('opponent-score', handleOpponentScoreUpdate);
        };
    }, [socket]);
    return (
        <div className = "container">
            {waitingForPlayers && <h3>Waiting for players to join to start the game...</h3>}
            <div className = "timer">Time: {timer}</div>
            <div className = "game-area">
                <div className="player-section">
                    <div className="player-name">{Username}</div>
                    <div className="score">Score: {score}</div>
                    <div className="clue">Clue: {sentence}</div>
                    <HangmanDrawing numberOfGuesses = {incorrectLetters.length} />
                    <HangmanWord word = {word} reveal = {isLoser} guessedLetters = {guessedLetter} />
                     <Keyboard disabled = {!gameActive || isWinner || isLoser} activeLetter={guessedLetter.filter(letter => word.includes(letter))}
                     inactiveLetters={incorrectLetters} addGuessedLetter={addGuessedLetter} 
                     />
                </div>
                <div className="opponent-section">
                    <div className="opponent-name">Opponent</div>
                    <div className="score">Score: {opponentScore}</div>
                    <div className="clue">Clue: {opponentSentence}</div>
                    <HangmanDrawing numberOfGuesses = {opponentIncorrectLetters.length} />
                    <HangmanWord word = {opponentWord} reveal = {false} guessedLetters = {opponentKeyPressed} />
                </div>
            </div>
            <ScoreModal 
                user = {Username}
                isOpen = {isModalOpen}
                player1score = {score}
                player2score = {opponentScore}
                 player2name = {opponentName.current}
                />
        </div>
    )

    // return (
    //     <div className="game-container">
    //         <div className="clue">
    //             <p>Clue: {sentence}</p> 
    //         </div>
    //         <div className="timer">
    //             <p>Time: {timer}</p>
    //             <p>Your Score: {score} </p>
    //             <p>Opponent Score: {opponentScore} </p>
    //         </div>
    //         <HangmanDrawing numberOfGuesses = {incorrectLetters.length} />
    //         <HangmanWord word = {word} reveal = {isLoser} guessedLetters = {guessedLetter} />
    //         <Keyboard disabled = {isWinner || isLoser} activeLetter={guessedLetter.filter(letter => word.includes(letter))}
    //             inactiveLetters={incorrectLetters} addGuessedLetter={addGuessedLetter} 
    //             />
    //         <div className="opponent-container">
    //             <p>Opponent Clue: {opponentSentence}</p>
    //             <HangmanDrawing
    //              isOpponent={true}
    //              numberOfGuesses={opponentIncorrectLetters.length} />
    //             <HangmanWord
    //              isOpponent={true}
    //              word = {opponentWord}
    //              reveal = {false}
    //              guessedLetters = {opponentKeyPressed} />
    //         </div>
    //         <ScoreModal 
    //           isOpen = {isModalOpen}
    //           onClose = {() => setIsModalOpen(false)}
    //           player1score = {score}
    //           player2score = {opponentScore}
    //           player2name = "Opponent"
    //            />
    //         </div>
    //     )
    }

    export default GameContainer;
