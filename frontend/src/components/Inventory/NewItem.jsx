import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { inventoryAPI } from '../../utils/api';

const UNIT_TYPES = ['unit', 'kg', 'g', 'lb', 'oz', 'L', 'mL', 'box', 'case', 'dozen', 'pallet'];

const emptyPrice = () => ({ min_quantity: '', max_quantity: '', price_per_unit: '' });

// Used for both creating (no stockId) and editing (stockId provided).
// When editing, item fields are read-only — only stock fields save to the DB.
export default function NewItem({ onAdd, onDelete, inventoryId, producerId, stockId, initialValues }) {
    const isEdit = !!stockId;
    const item = initialValues?.item ?? {};
    const prices = initialValues?.prices ?? [];

    const [name, setName] = useState(item.name ?? '');
    const [unitType, setUnitType] = useState(item.unit_type ?? 'unit');
    const [description, setDescription] = useState(item.description ?? '');
    const [sku, setSku] = useState(item.sku ?? '');
    const [quantity, setQuantity] = useState(initialValues?.quantity ?? '');
    const [batchNumber, setBatchNumber] = useState(initialValues?.batch_number ?? '');
    const [expirationDate, setExpirationDate] = useState(initialValues?.expiration_date ?? '');
    const [priceTiers, setPriceTiers] = useState(
        prices.length > 0
            ? prices.map(p => ({ min_quantity: p.min_quantity, max_quantity: p.max_quantity ?? '', price_per_unit: p.price_per_unit }))
            : [emptyPrice()]
    );
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const updatePrice = (index, field, value) => {
        setPriceTiers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            if (isEdit) {
                await inventoryAPI.updateStock(stockId, {
                    quantity: parseFloat(quantity),
                    batch_number: batchNumber || null,
                    expiration_date: expirationDate || null,
                });
                onAdd(stockId, {
                    quantity: parseFloat(quantity),
                    batch_number: batchNumber || null,
                    expiration_date: expirationDate || null,
                });
            } else {
                const payload = {
                    inventory_id: inventoryId,
                    quantity: parseFloat(quantity),
                    batch_number: batchNumber || undefined,
                    expiration_date: expirationDate || undefined,
                    item: {
                        name,
                        unit_type: unitType,
                        producer_id: producerId,
                        description: description || undefined,
                        sku: sku || undefined,
                    },
                    prices: priceTiers.map(p => ({
                        min_quantity: parseFloat(p.min_quantity),
                        max_quantity: p.max_quantity !== '' ? parseFloat(p.max_quantity) : undefined,
                        price_per_unit: parseFloat(p.price_per_unit),
                    })),
                };
                const result = await inventoryAPI.createStock(payload);
                onAdd(result.stock);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="new-item-form">
            <form onSubmit={handleSubmit}>

                <p className="form-section-label">Item</p>
                <input
                    type="text" placeholder="Item name *" required
                    value={name} onChange={e => setName(e.target.value)}
                    readOnly={isEdit}
                    className={isEdit ? 'field-readonly' : ''}
                />
                <div className="stock-fields">
                    <div className="select-wrapper">
                        <select
                            value={unitType} onChange={e => setUnitType(e.target.value)}
                            disabled={isEdit}
                        >
                            {UNIT_TYPES.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <ChevronDown size={14} className="select-chevron" />
                    </div>
                    <input
                        type="text" placeholder="SKU (optional)"
                        value={sku} onChange={e => setSku(e.target.value)}
                        readOnly={isEdit}
                        className={isEdit ? 'field-readonly' : ''}
                    />
                </div>
                <textarea
                    placeholder="Description (optional)" rows={2}
                    value={description} onChange={e => setDescription(e.target.value)}
                    readOnly={isEdit}
                    className={isEdit ? 'field-readonly' : ''}
                />

                <hr className="form-divider" />
                <p className="form-section-label">Stock</p>

                <div className="stock-fields">
                    <input
                        type="number" placeholder="Quantity *" required min="0" step="any"
                        value={quantity} onChange={e => setQuantity(e.target.value)}
                    />
                    <input
                        type="text" placeholder="Batch no. (optional)"
                        value={batchNumber} onChange={e => setBatchNumber(e.target.value)}
                    />
                    <input
                        type="date"
                        value={expirationDate} onChange={e => setExpirationDate(e.target.value)}
                    />
                </div>

                <hr className="form-divider" />
                <p className="form-section-label">Pricing tiers</p>

                <div className="price-tier-header">
                    <span>Min qty {!isEdit && '*'}</span>
                    <span>Max qty</span>
                    <span>$ / unit {!isEdit && '*'}</span>
                    <span />
                </div>

                <div className="price-tiers">
                    {priceTiers.map((p, i) => (
                        <div key={i} className="price-tier">
                            <input
                                type="number" placeholder="0" min="0" step="any"
                                required={!isEdit}
                                value={p.min_quantity} onChange={e => updatePrice(i, 'min_quantity', e.target.value)}
                                readOnly={isEdit}
                                className={isEdit ? 'field-readonly' : ''}
                            />
                            <input
                                type="number" placeholder="—" min="0" step="any"
                                value={p.max_quantity} onChange={e => updatePrice(i, 'max_quantity', e.target.value)}
                                readOnly={isEdit}
                                className={isEdit ? 'field-readonly' : ''}
                            />
                            <input
                                type="number" placeholder="0.00" min="0" step="0.01"
                                required={!isEdit}
                                value={p.price_per_unit} onChange={e => updatePrice(i, 'price_per_unit', e.target.value)}
                                readOnly={isEdit}
                                className={isEdit ? 'field-readonly' : ''}
                            />
                            {!isEdit && priceTiers.length > 1 && (
                                <button
                                    type="button" className="remove-tier-btn"
                                    onClick={() => setPriceTiers(prev => prev.filter((_, j) => j !== i))}
                                >✕</button>
                            )}
                            {(isEdit || priceTiers.length === 1) && <span />}
                        </div>
                    ))}
                </div>

                {!isEdit && (
                    <button type="button" className="add-tier-btn" onClick={() => setPriceTiers(prev => [...prev, emptyPrice()])}>
                        + Add tier
                    </button>
                )}

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                    {isEdit && (
                        <button
                            type="button"
                            className="btn-delete"
                            disabled={deleting || submitting}
                            onClick={async () => {
                                setDeleting(true);
                                setError(null);
                                try {
                                    await inventoryAPI.deleteStock(stockId);
                                    onDelete(stockId);
                                } catch (err) {
                                    setError(err.message);
                                    setDeleting(false);
                                }
                            }}
                        >
                            {deleting ? 'Deleting…' : 'Delete Stock'}
                        </button>
                    )}
                    <button type="submit" disabled={submitting || deleting}>
                        {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Stock'}
                    </button>
                </div>
            </form>
        </div>
    );
}
