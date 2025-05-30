import coffeImg from "./../../assets/images/banner/morning-coffee.png";

export default function CartEmpty() {
  return (
    <div className="cart-empty">
      <img src={coffeImg} alt="Empty Cart" className="cart-empty-image" />
      <p className="cart-empty-title">Your cart is empty</p>
      <p className="cart-empty-message">{"Add something to make me happy :)"}</p>
    </div>
  );
}
