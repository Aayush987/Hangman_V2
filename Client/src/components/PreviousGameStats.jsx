import { collection, doc, onSnapshot } from "firebase/firestore";
import { useUserContext } from "../Providers/UserProvider";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";


const PreviousGameStats = () => {
 const {Username,email} = useUserContext();
 const [data, setData] = useState([]);  

 useEffect(() => {
    if(!email) {
        console.log("Email is Undefined");
        return;
    }

    
    // console.log(Username);
    const docRef = doc(db,"Users",email);
    // console.log(docRef);
     const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.data().games);
            setData(snapshot.data().games);
            console.log(data);
        } else {
            console.log("No such document!");
            setData(null);
        }
     }, (error) => {
        console.log("Error fetching data",error);
     });

     return () => unsubscribe();
 }, [email]);

 const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', { // Change 'en-IN' to your preferred locale
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // Set to false for 24-hour format
    });
};
 

   



    return (
        <div className="game-stats">
             <h2>Recent Games</h2>
             {data.length === 0 ? (
                <h2>No Previous Game results found</h2>
             ): (
                <table>
                <thead>
                    <tr>
                        <th>Opponent</th>
                        <th>Your Result</th>
                        <th>Your Score</th>
                        <th>Timestamp</th>
                    </tr>
                 </thead>
                    <tbody>
                       {data.map(item => {
                        return (
                            <tr>
                                <td>{item.opponent}</td>
                                <td className= {item.result === 'Won' ? 'win' : 'lose'}>{item.result}</td>
                                <td>{item.score}</td>
                                <td>{formatTimestamp(item.timestamp)}</td>
                            </tr>
                        )
                       })}
                    </tbody>    
            </table>
             )} 
        </div>
    );
};

export default PreviousGameStats;