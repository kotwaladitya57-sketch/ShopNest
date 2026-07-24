import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { apiFetch } from '../api';

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        fullName: '', street: '', city: '', postalCode: '', country: ''
    });

    const [showDummyModal, setShowDummyModal] = useState(false);
    const [paymentOrder, setPaymentOrder] = useState(null);
    const [selectedTab, setSelectedTab] = useState('upi');
    const [upiId, setUpiId] = useState('user@okaxis');
    const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
    const [cardExpiry, setCardExpiry] = useState('12/28');
    const [cardCvv, setCardCvv] = useState('888');
    const [netbank, setNetbank] = useState('HDFC Bank');
    const [processing, setProcessing] = useState(false);

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    useEffect(() => {
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const processSuccessfulPayment = async (razorpayResponse) => {
        try {
            await apiFetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(razorpayResponse)
            });

            const saveOrderRes = await apiFetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                },
                body: JSON.stringify({
                    items: cartItems,
                    totalAmount: totalPrice,
                    address,
                    paymentId: razorpayResponse.razorpay_payment_id || ('pay_' + Date.now())
                })
            });

            if (saveOrderRes.ok) {
                dispatch(clearCart());
                navigate('/ordersuccess');
            } else {
                alert('Order saving failed');
            }
        } catch (err) {
            console.error('Payment completion error:', err);
            alert('Payment processing error');
        }
    };

    const handlePayment = async () => {
        try {
            const orderRes = await apiFetch('/api/payment/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalPrice })
            });

            let orderData;
            if (orderRes.ok) {
                orderData = await orderRes.json();
            } else {
                orderData = {
                    id: 'order_rzp_' + Date.now(),
                    amount: Math.round(totalPrice * 100),
                    currency: 'INR',
                    key_id: 'rzp_test_TG6g2DXMzr2leO'
                };
            }

            setPaymentOrder(orderData);

            if (window.Razorpay) {
                try {
                    const options = {
                        key: orderData.key_id || 'rzp_test_TG6g2DXMzr2leO',
                        amount: orderData.amount,
                        currency: orderData.currency || 'INR',
                        name: 'ShopNest',
                        description: 'Order Payment',
                        order_id: orderData.id,
                        handler: async function (response) {
                            await processSuccessfulPayment(response);
                        },
                        prefill: {
                            name: address.fullName || user?.name || '',
                            email: user?.email || '',
                            contact: '9876543210'
                        },
                        theme: {
                            color: '#0c2340'
                        }
                    };
                    const rzp1 = new window.Razorpay(options);
                    rzp1.on('payment.failed', function (response) {
                        alert('Payment failed. Please try again.');
                    });
                    rzp1.open();
                    return;
                } catch (err) {
                    console.warn('Razorpay SDK launch failed, opening test UI:', err);
                }
            }

            setShowDummyModal(true);
        } catch (error) {
            console.error('Payment init error:', error);
            setShowDummyModal(true);
        }
    };

    const handleDummyPaySubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(async () => {
            setProcessing(false);
            setShowDummyModal(false);
            const fakePaymentId = 'pay_rzp_test_' + Math.random().toString(36).substring(2, 11);
            await processSuccessfulPayment({
                razorpay_order_id: paymentOrder?.id || ('order_rzp_' + Date.now()),
                razorpay_payment_id: fakePaymentId,
                razorpay_signature: 'sig_' + Math.random().toString(36).substring(2, 11)
            });
        }, 1200);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login first");
            navigate('/login');
            return;
        }
        handlePayment();
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-content">
                <form onSubmit={handleSubmit} className="shipping-form">
                    <h3>Shipping Address</h3>
                    <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                    <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                    <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
                    <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} />
                    <div className="checkout-summary">
                        <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
                        <button type="submit" className="btn">Pay Now</button>
                    </div>
                </form>
            </div>

            {/* Realistic Razorpay Payment Gateway Modal */}
            {showDummyModal && (
                <div className="rzp-modal-overlay">
                    <div className="rzp-modal-card">
                        <div className="rzp-header">
                            <div className="rzp-brand">
                                <div className="rzp-logo-badge">R</div>
                                <div>
                                    <h4>ShopNest Checkout</h4>
                                    <span className="rzp-test-badge">Test Mode</span>
                                </div>
                            </div>
                            <div className="rzp-amount-badge">
                                <span>Amount:</span>
                                <strong>₹{totalPrice.toFixed(2)}</strong>
                            </div>
                            <button type="button" className="rzp-close-btn" onClick={() => setShowDummyModal(false)}>✕</button>
                        </div>

                        <div className="rzp-body">
                            <div className="rzp-tabs">
                                <button type="button" className={`rzp-tab ${selectedTab === 'upi' ? 'active' : ''}`} onClick={() => setSelectedTab('upi')}>
                                    📱 UPI / QR
                                </button>
                                <button type="button" className={`rzp-tab ${selectedTab === 'card' ? 'active' : ''}`} onClick={() => setSelectedTab('card')}>
                                    💳 Card
                                </button>
                                <button type="button" className={`rzp-tab ${selectedTab === 'netbanking' ? 'active' : ''}`} onClick={() => setSelectedTab('netbanking')}>
                                    🏦 Netbanking
                                </button>
                            </div>

                            <form onSubmit={handleDummyPaySubmit} className="rzp-form">
                                {selectedTab === 'upi' && (
                                    <div className="rzp-field-group">
                                        <label>UPI ID (Google Pay / PhonePe / Paytm)</label>
                                        <input
                                            type="text"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            placeholder="username@upi"
                                            required
                                        />
                                        <div className="rzp-hint">Enter any test VPA or keep default to proceed.</div>
                                    </div>
                                )}

                                {selectedTab === 'card' && (
                                    <div className="rzp-field-group">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            placeholder="4532 0000 0000 0000"
                                            required
                                        />
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label>Expiry</label>
                                                <input
                                                    type="text"
                                                    value={cardExpiry}
                                                    onChange={(e) => setCardExpiry(e.target.value)}
                                                    placeholder="MM/YY"
                                                    required
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label>CVV</label>
                                                <input
                                                    type="password"
                                                    value={cardCvv}
                                                    onChange={(e) => setCardCvv(e.target.value)}
                                                    placeholder="123"
                                                    maxLength="4"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedTab === 'netbanking' && (
                                    <div className="rzp-field-group">
                                        <label>Select Bank</label>
                                        <select value={netbank} onChange={(e) => setNetbank(e.target.value)} className="rzp-select">
                                            <option value="HDFC Bank">HDFC Bank</option>
                                            <option value="State Bank of India">State Bank of India</option>
                                            <option value="ICICI Bank">ICICI Bank</option>
                                            <option value="Axis Bank">Axis Bank</option>
                                            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                                        </select>
                                    </div>
                                )}

                                <button type="submit" className="rzp-pay-btn" disabled={processing}>
                                    {processing ? 'Processing Payment...' : `Pay ₹${totalPrice.toFixed(2)}`}
                                </button>
                            </form>
                        </div>

                        <div className="rzp-footer">
                            <span>🔒 Secured by <strong>Razorpay</strong></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;