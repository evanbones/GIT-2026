import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import { useAuth } from '../contexts/useAuth.jsx';
import { authAPI } from '../utils/api.js';
import './Onboard.css';

export default function Onboard() {
    const navigate = useNavigate();
    const { checkAuthStatus } = useAuth();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submitBasicOnboard = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await authAPI.onboard({
                user_type: type.toLowerCase(),
                company_name: name,
                address,
                description,
            });
            await checkAuthStatus();
            navigate(type === "Producer" ? "/inventory" : "/dashboard", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="onboard-page">
            <Header />
            <form className="onboard-form" onSubmit={submitBasicOnboard}>
                <h2>Set Up Your Business</h2>

                <input
                    type="text"
                    placeholder="Business Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Business Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />

                <div className="onboard-radio-group">
                    <label>
                        <input
                            type="radio"
                            name="business type"
                            value="Producer"
                            onChange={(e) => setType(e.target.value)}
                            required
                        />
                        Producer
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="business type"
                            value="Retailer"
                            onChange={(e) => setType(e.target.value)}
                        />
                        Retailer
                    </label>
                </div>

                <input
                    type="text"
                    placeholder="Business Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {error && <p className="onboard-error">{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting ? "Setting up..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
