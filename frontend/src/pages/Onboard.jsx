import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Inventory from '../components/Inventory/Inventory.jsx';

import './Onboard.css';

export default function Onboard() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");

    const submitBasicOnboard = (e) => {
        e.preventDefault();
        console.log(name, type, address, description, link);
        //put in database pls
        if (type == "Retailer") {
            navigate("/map")
        } else { // Retailer
            // stuff goes here
            setVisible(false);
        }
    }

    return (
        <div className="onboard-page">
            {visible &&
                <form className="onboard-form" onSubmit={submitBasicOnboard}>
                    <h2>Set Up Your Business</h2>
                    <input type="text" placeholder="Business Name"
                        value={name} onChange={(e) => setName(e.target.value)} />

                    <input type="address" placeholder="Business Address"
                        value={address} onChange={(e) => setAddress(e.target.value)} />

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
                </form>}
            {!visible &&
                <Inventory />
            }
        </div>
    )

}
