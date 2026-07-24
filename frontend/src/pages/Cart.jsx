import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart } from '../redux/cartSlice';
import '../styles/product.css';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn">Browse Products</Link>
        </div>
      ) : (
        <>
          <div className="cart-grid">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id || item.productId} className="cart-item">
                  <img src={item.imageURL || item.imageUrl || ''} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>Price: ₹{Number(item.price || 0).toFixed(2)}</p>
                    <p>Quantity: {item.qty || 1}</p>
                    <p>Total: ₹{((item.price || 0) * (item.qty || 1)).toFixed(2)}</p>
                    <button onClick={() => handleRemove(item._id || item.productId)} className="btn btn-secondary">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <p>Items: {cartItems.length}</p>
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <div className="cart-actions">
                <button onClick={handleClear} className="btn btn-secondary">Clear Cart</button>
                <Link to="/checkout" className="btn">Proceed to Checkout</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
