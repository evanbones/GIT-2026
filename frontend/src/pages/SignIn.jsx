import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header.jsx"

import './SignIn.css';

function SignIn({ account, setAccount }) {

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = (e) => {
        e.preventDefault();
        //check database
        const success = true;
        if (success) {
            setAccount(true);
            setError("");
            navigate("/dashboard");
        } else {
            setError("Error: Login Invalid. Try Again");
        }
    }

    return (
        <div className="signin-page">
            <Header account={account} setAccount={setAccount} />
            <form className="signin-form" onSubmit={login}>
                <h2>Sign In</h2>
                <input type="text" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Sign In</button>
                {error && <p className="signin-error">{error}</p>}
            </form>
        </div>
    )
}

export default SignIn
