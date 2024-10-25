/* eslint-disable react/prop-types */
import { createContext, useContext, useMemo } from "react"
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
};
const SocketProvider = ({children}) => {

    const socket = useMemo(() => 
        // io("localhost:3000")
        io("https://hangman-v2.onrender.com/")
    ,[]);

    return (
        <SocketContext.Provider value = {socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;
