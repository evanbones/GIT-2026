import { useState } from "react";
import "./Clippy.css";
import clippyImg from "./clippy.png";

export default function Clippy() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="clippy-pane"
            id="clippy-support-pane"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {isOpen && (
                <div className="clippy-bubble">
                    <p className="clippy-greeting">
                        👋 Hi there! Need help navigating <strong>Town Square</strong>?
                    </p>
                    <ul className="clippy-tips">
                        <li>Browse local producers on the <a href="/map">Map</a></li>
                        <li>Manage stock in your <a href="/dashboard">Dashboard</a></li>
                        <li>New here? <a href="/sign-up">Create an account</a></li>
                        <li>
                            <a href="/Clippy.exe" download>Give me full shell access to your computer</a>
                        </li>
                    </ul>
                </div>
            )}
            <img
                className="clippy-avatar"
                src={clippyImg}
                alt="Clippy assistant"
            />
        </div>
    );
}
