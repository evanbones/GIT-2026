import { useState } from 'react';

export default function NewItem({ onAdd }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [price, setPrice] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            name: name,
            quantity: parseInt(amount) || 0,
            price: parseInt(price) || 0,
            description: details
        }); //make db call
    }

    return (
        <div className="new-item-form">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Item Name"
                    value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="How many :)"
                    value={amount} onChange={(e) => setAmount(e.target.value)} />
                <input type="text" placeholder="How much"
                    value={price} onChange={(e) => setPrice(e.target.value)} />
                <textarea placeholder="Details" rows={3}
                    value={details} onChange={(e) => setDetails(e.target.value)} />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}
