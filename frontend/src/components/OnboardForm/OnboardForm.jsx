import { useState } from "react";
import "./OnboardForm.css";

function OnboardForm() {

    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [productsSold, setProductsSold] = useState([]);

    const productOptions = ["Wine", "Beer", "Cider", "Spirits", "...food"];

    const handleProductChange = (value) => {
        if (productsSold.includes(value)) {
            setProductsSold(productsSold.filter((p) => p !== value));
        } else {
            setProductsSold([...productsSold, value]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Not implemented!!");
    }

    return (
        <div className="onboard-form">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Business Name"
                    value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                <div className="radio-group">
                    <label>
                        <input type="radio" name="business type" value="Producer"
                            onClick={(e) => setBusinessType(e.target.value)} />
                        Producer
                    </label>
                    <label>
                        <input type="radio" name="business type" value="Retailer"
                            onClick={(e) => setBusinessType(e.target.value)} />
                        Retailer
                    </label>
                </div>

                {businessType === "Producer" && (
                    <details className="product-options">
                        <summary>
                            {productsSold.length > 0
                                ? productsSold.join(", ")
                                : "What do you sell?"}
                        </summary>
                        <div className="dropdown-menu">
                            {productOptions.map((option) => (
                                <label key={option}>
                                    <input
                                        type="checkbox"
                                        checked={productsSold.includes(option)}
                                        onChange={() => handleProductChange(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </details>
                )}
                <button type="submit">Submit</button>

            </form>
        </div>
    )
}

export default OnboardForm;