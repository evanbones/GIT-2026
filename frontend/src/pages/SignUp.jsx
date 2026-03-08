import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import "./SignUp.css";

function SignUp({ account, setAccount }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    //from stack overflow
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePassword = (password) => {
        return String(password).length >= 8;
    }

    const handleCredsSubmit = (e) => {
        e.preventDefault();
        console.log(email, password);

        if (!validateEmail(email)) {
            setError("Error: email is invalid");
        } else if (!validatePassword(password)) {
            setError("Error: Password must be at least 8 characters");
        } else {
            setError("");
            // put info in db
            setAccount(true);
            navigate("/onboard");
        }
    }

    return (
        <div className="signup-page">
            <Header account={account} setAccount={setAccount} />
            <form className="signup-form" onSubmit={handleCredsSubmit}>
                <h2>Sign Up</h2>
                <input type="text" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="signup-error">{error}</p>}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp
