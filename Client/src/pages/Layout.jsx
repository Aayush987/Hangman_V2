import { Link, Outlet } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useUserContext } from "../Providers/UserProvider";


const Layout = () => {
    const {Username} = useUserContext();

    return (
        <div className="layout">
               <header>
                 <nav className="navbar">
                    <div className="container navbar-content">
                        <a href="/" className="logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3v18" />
                        <path d="M6 7h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6" />
                    </svg>
                    Hangman
                </a>
                <button className="account-button">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </button>
            </div>
        </nav>
    </header>
            <main>
                <Outlet />
            </main>
            <footer className="footer">
                <div className="container">
                <p>&copy; 2024 Multiplayer Hangman Game. All rights reserved.</p>
                </div>
            </footer>
            </div>
    );
};

export default Layout;