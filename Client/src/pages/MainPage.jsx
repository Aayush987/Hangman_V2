// import GameContainer from "../components/GameContainer";
// import { io } from "socket.io-client";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import {useUserContext} from "../Providers/UserProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PreviousGameStats from "../components/PreviousGameStats";

const MainPage = () => {
    const [hangmanParts, setHangmanParts] = useState(Array(10).fill(false));
    const {Username, email} = useUserContext();
    const navigate = useNavigate();

   useEffect(() => {
      let currentPart = 0;
      const interval = setInterval(() => {
          setHangmanParts((prev) => {
            const newParts = [...prev];
            newParts[currentPart] = true;
            currentPart = (currentPart + 1) % 10;
            if(currentPart === 0) {
                return Array(10).fill(false);
            }
            return newParts;
      })
   }, 1000);

   return () => clearInterval(interval);
   }, []);
   
   const handleClick = () => {
      navigate('/multiplayer');
   }

    return (
        <main>
        <div className="container">
            <h1>Multiplayer Hangman Game</h1>
            <p className="description">Challenge your friends in this classic word-guessing game. Compete, learn, and have fun together!</p>
            <button onClick={handleClick} className="cta-button">Start Playing Now</button>

            <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hangman-svg"> 
                <line x1="20" y1="180" x2="100" y2="180" />
                <line x1="60" y1="20" x2="60" y2="180" />
                <line x1="60" y1="20" x2="140" y2="20" />
                <line x1="140" y1="20" x2="140" y2="50" />
                <circle cx="140" cy="70" r="20" />
                <line x1="140" y1="90" x2="140" y2="130" />
                <line x1="140" y1="100" x2="120" y2="120" />
                <line x1="140" y1="100" x2="160" y2="120" />
                <line x1="140" y1="130" x2="120" y2="160" />
                <line x1="140" y1="130" x2="160" y2="160" />
            </svg>

            <PreviousGameStats email = {email} />

            <div className="features">
                <div className="feature">
                    <h3>Multiplayer</h3>
                    <p>Play with a friend to compete who is the word wizard.</p>
                </div>
                <div className="feature">
                    <h3>Custom Words</h3>
                    <p>Create your own word lists or choose from various categories.</p>
                    <span className="red-clr">Coming Soon....</span>
                </div>
                <div className="feature">
                    <h3>Leaderboards</h3>
                    <p>Compete for the top spot and show off your word-guessing skills.</p>
                    <span className="red-clr">Coming Soon....</span>
                </div>
            </div>
        </div>

       {/* <div className="game-options">
        <button className="btn">Play Alone</button>
        <button className="btn">Play With A Friend</button>
       </div> */}
           {/* <GameContainer />
           <GameContainer /> */}
        </main>
    );
};

export default MainPage;