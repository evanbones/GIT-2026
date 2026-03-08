import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header.jsx";

import './Onboard.css';

export default function Onboard({ account, setAccount }) {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");

    const submitBasicOnboard = (e) => {
        e.preventDefault();
        console.log(name, type, address, description, link);
        //put in database pls
        if (type === "Producer") {
            navigate("/map");
        } else if (type === "Retailer") {
            navigate("/dashboard");
        }
    }

    return (
<<<<<<< HEAD
        // Root container for full height, background image, centering
        <div className="onboard-page hero-framework"> 
            
            {/* Main content container for hero sections/elements */}
            <div className="hero-content">

                {/* Optional: Simple hero header content can go here */}
                {/* <h1>Welcome to Graeme's!</h1> */}
                {/* <p>Set up your profile to connect.</p> */}

                {/* The existing onboarding form */}
                <form className="onboard-form" onSubmit={submitBasicOnboard}>
                    <h2>Set Up Your Business</h2>
                    <input type="text" placeholder="Business Name"
                        value={name} onChange={(e) => setName(e.target.value)} />

                    <input type="address" placeholder="Business Address"
                        value={address} onChange={(e) => setAddress(e.target.value)} />
=======
        <div className="onboard-page">
            <Header account={account} setAccount={setAccount} />
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
                    placeholder="Business Description"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                />
                
                <input 
                    type="text" 
                    placeholder="Website link"
                    value={link} 
                    onChange={(e) => setLink(e.target.value)} 
                />
>>>>>>> 3bc7a03604c3f0bf3b86754b8a581e3013e94120

                    <div className="onboard-radio-group">
                        <label>
                            <input type="radio" name="business type" value="Producer"
                                onClick={(e) => setType(e.target.value)} />
                            Producer
                        </label>
                        <label>
                            <input type="radio" name="business type" value="Retailer"
                                onClick={(e) => setType(e.target.value)} />
                            Retailer
                        </label>
                    </div>

                    <input type="text" placeholder="Business Description"
                        value={description} onChange={(e) => setDescription(e.target.value)} />
                    <input type="text" placeholder="Website link"
                        value={link} onChange={(e) => setLink(e.target.value)} />

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
<<<<<<< HEAD
    )

}
=======
    );
}
>>>>>>> 3bc7a03604c3f0bf3b86754b8a581e3013e94120
