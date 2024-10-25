import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Providers/UserProvider";
import { Trophy, Frown } from "lucide-react";

const ScoreModal = ({user,isOpen, player1score, player2score, player2name}) => {
    
    // const {Username} = useUserContext();

    if(!isOpen) return null;

    const playerwon = player1score > player2score ;
    const navigate = useNavigate();

    const onClose = () => {
         navigate('/');
    }

    return (
        <div className="model-container"> 
              <div className="modal-content">
                <div className="modal-header">
                <h2 className={playerwon ? "winner" : "loser"}>
                    {playerwon ? (
                        <>You Win! <span className="icon-trophy"><Trophy /></span></>
                    ): (
                        <>You Lost! <span className="icon-frown"><Frown /></span></>
                    )}
                </h2>
                 <p className="modal-description">Here's how you and your opponent scored</p>
                </div>
                <div className="modal-body">
                    <div className="scores">
                        <div className="score">
                        <h3>{user}</h3>
                        <p className = {playerwon ? "winner" : "loser"}>{player1score}</p>
                        </div>
                    
                    <div className="score">
                        <h3>{player2name}</h3>
                        <p className = {playerwon ? "loser" : "winner"}>{player2score}</p>
                    </div>
                    </div>
                <a className= "cta-button" href="/">Go Back to Menu</a>
                </div>
                {/* <button className= "menu-button">Share </button> */}
              </div>
        </div>
    );
};

export default ScoreModal;