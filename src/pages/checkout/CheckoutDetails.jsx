export default function CheckoutDetails({ calculateTotal, handleSubmit }) {
    return (
        <div className="checkout-details">
            <h2>Checkout</h2>
            <div className="total">
                <strong>Total:</strong> <span>Rp. {new Intl.NumberFormat('id-ID').format(calculateTotal())}</span>
            </div>

            <form className="checkout-form" onSubmit={handleSubmit}>
                <label>Full Name:</label>
                <input type="text" placeholder="Enter your name" defaultValue="Guest" required />

                <label>Email:</label>
                <input type="email" placeholder="Enter your email" defaultValue="guest@email.com" required />

                <label>Address:</label>
                <textarea placeholder="Enter your delivery address" defaultValue="Guest Address" required></textarea>

                <label>Payment Method:</label>
                <select required>
                    <option value="" disabled selected>Select Payment Method</option>
                    <option value="qris">QRIS</option>
                    <option value="gopay">GoPay</option>
                    <option value="shopeepay">ShopeePay</option>
                    <option value="ovo">OVO</option>
                    <option value="dana">DANA</option>
                    <option value="cod">Cash on Delivery</option>
                </select>


                <button type="submit">Place Order</button>
            </form>
        </div>
    );
}
