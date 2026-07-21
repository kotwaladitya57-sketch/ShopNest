const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user1', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ecoProduct', required: true },
            quantity: { type: Number, required: true },
            price:{ type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    address: {
        fullName: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentId: { type: String },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema);
