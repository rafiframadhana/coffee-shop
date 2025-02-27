import { useCart } from '../../context/CartContext';
import CartEmpty from './CartEmpty';

export default function Cart({ handleUpdateClick, handleSaveClick, editingItem, newQuantity, setNewQuantity }) {
    const { cart, deleteItem } = useCart();

    const renderQuantitySection = (item) => {
        return editingItem === item.id ? (
            <>
                <p>Qty:
                    <input className="quantity-input" type="number" min="1" value={newQuantity}
                           onChange={(e) => setNewQuantity(Number(e.target.value))} />
                </p>
                <p onClick={() => handleSaveClick(item.id)} className="save-btn">Save</p>
            </>
        ) : (
            <>
                <p>Qty: {item.quantity}</p>
                <p onClick={() => handleUpdateClick(item.id, item.quantity)} className="update-btn">Update</p>
            </>
        );
    };

    return (
        <div className="order-summary">
            <h2>Order Summary</h2>
            {cart.length === 0 && <CartEmpty />}
            {cart.map((item) => (
                <div className="order-item" key={item.id}>
                    <img src={item.src} alt={item.name} className="product-image" />
                    <div className="item-details">
                        <h3>{item.name}</h3>
                        <div className="quantity-container">
                            {renderQuantitySection(item)}
                            <p className="delete-btn" onClick={() => deleteItem(item.id)}>Delete</p>
                        </div>
                        <p><strong>Rp. {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</strong></p>
                    </div>
                </div>
            ))}
        </div>
    );
}
