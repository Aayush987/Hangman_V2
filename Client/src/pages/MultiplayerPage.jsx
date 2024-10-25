import { useEffect, useState } from "react";
import { useSocket } from "../Providers/SocketProvider";
import {v4 as uuid} from "uuid";
import {useNavigate} from "react-router-dom";
import { useUserContext } from "../Providers/UserProvider";



const MultiplayerPage = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const {Username,email} = useUserContext();
    // console.log(name,email);
    // console.log(socket);
    
    // const [isConnected, setIsConnected] = useState(false);
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');
    const [roomfullError, setRoomfullError] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    // const [messages, setMessages] = useState([]);

   

    const handleCreateRoomId = () => {
         const newRoomId = uuid();
         setRoomId(newRoomId);
    }

    const handleJoinRoomId = () => {
        setIsJoining(true);
        setRoomfullError(false);
        
        socket.emit('join-room',{name,email,roomId});
        // socket.on('room-player-count', ({count}) => {
        //     if(count < 2) {
        //         console.log("User", name ,"Joining Room", roomId);
        //         navigate(`/multiplayer/${roomId}`);
        //     }else if(count >= 2) {
        //         setRoomfullError(true);
        //     }
        // })
        // socket.emit('join-room',{name,email,roomId});
        // console.log(roomfullError);
        // if(roomfullError == false) {
        //     navigate(`/multiplayer/${roomId}`); 
        // }
    }

    useEffect(() => {
        if(!email) {
            alert("You need to log in to access this page!");
            navigate('/');
        }
    },[email,navigate]);

    
        useEffect(() => {
            const handleRoomPlayerCount = ({count}) => {
                console.log(count);
                if(count <= 2) {
                    console.log("User", name ,"Joining Room", roomId);
                    navigate(`/multiplayer/${roomId}`);
                } else {
                    setRoomfullError(true);
                }
                setIsJoining(false);
                }
            socket.on('connect', () => {
                console.log("Connected to server");
            })
            
            socket.on('disconnect', () => {
                console.log("Disconnected from server");
            })

            socket.on('room-full-error', ({message}) => {
                setRoomfullError(true);
                console.log(message);
            })

            socket.on('user-joined', ({name,email,roomId}) => {
                // console.log(name);
                // if(email == email) {
                //     console.log("You Joined Room", roomId);
                // }else {
                //     console.log("User", name,email ,"Joins Room", roomId);
                // }
                // console.log("User", name ,"Joins Room", roomId);
            })
            socket.on('room-player-count', handleRoomPlayerCount);
            socket.on('msg', (data) => {
                console.log(data);
            })

            socket.on('user-already-in-room', ({message}) => {
                alert(message);
            })
           
            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('room-player-count', handleRoomPlayerCount);
                socket.off('room-full-error');
                socket.off('user-joined');
                socket.off('msg');
                socket.off('user-already-in-room');
            }
        },[roomfullError,socket, handleJoinRoomId]);  
    
    return (
        <div className="room-box">
            <h1>Create Or Join a Room To Play</h1>
            <input className="input" value={name} onChange= {(e) => setName(e.target.value)} type="text" placeholder="Enter Your Name" />
            <input className="input" value={roomId} onChange={(e) => setRoomId(e.target.value)} type="text" placeholder="Enter Room ID" />
            <button className="cta-button" onClick={handleCreateRoomId}>Create Room</button>
            <button className="cta-button" onClick={handleJoinRoomId}>Join Room</button>   
            {roomfullError && <p className="error-message">Room is full</p>}
        </div>
    );
}

export default MultiplayerPage;