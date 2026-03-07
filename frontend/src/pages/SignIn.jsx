import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './SignIn.css';

function SignIn({ setAccount }) {
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
