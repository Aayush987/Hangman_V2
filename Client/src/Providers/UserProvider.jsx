/* eslint-disable react/prop-types */
import { ClerkProvider } from "@clerk/clerk-react";
import {createContext, useState, useContext } from "react";
import { useUser } from "@clerk/clerk-react";


const UserContext = createContext();

const UserProvider = ({children}) => {
    const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!key) {
  throw new Error("Missing Publishable Key")
}
    return (
        <ClerkProvider publishableKey={key}>
                <UserContextWrapper>
                    {children};
                </UserContextWrapper>
        </ClerkProvider>
    );
};

const UserContextWrapper = ({ children }) => {
    const { user } = useUser();
    const Username = user?.fullName;
    const email = user?.primaryEmailAddress.emailAddress;
    // console.log(Username);
    // console.log(email);


    return (
        <UserContext.Provider value={{ Username, email }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUserContext = () => {
    const context = useContext(UserContext);
    return context;
}


export default UserProvider;