import "./Clippy.css";
import clippyImg from "./clippy.png";

export default function Clippy() {
    return (
        <div className="clippy-pane" id="clippy-support-pane">
            <img
                className="clippy-avatar"
                src={clippyImg}
                alt="Clippy assistant"
            />
            <div className="clippy-bubble">
                <p className="clippy-greeting">
                    👋 Hi there! Need help navigating <strong>GRAEME</strong>?
                </p>
                <ul className="clippy-tips">
                    <li>Browse local producers on the <a href="/map">Map</a></li>
                    <li>Manage stock in your <a href="/dashboard">Dashboard</a></li>
                    <li>New here? <a href="/sign-up">Create an account</a></li>
                </ul>
            </div>
        </div>
    );
}
