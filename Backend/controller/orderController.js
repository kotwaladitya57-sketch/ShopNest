const Order = require('../model/order');
const sendMail = require('../utils/sendMail');



const createOrder = async (req, res) => {
    try {
        const { products = [], totalAmount, address, paymentId } = req.body;

        if (!Array.isArray(products) || products.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const normalizedAddress = typeof address === 'string'
            ? {
                fullName: 'N/A',
                street: address,
                city: 'N/A',
                pincode: 'N/A',
                country: 'N/A'
            }
            : {
                fullName: address?.fullName || 'N/A',
                street: address?.street || 'N/A',
                city: address?.city || 'N/A',
                pincode: address?.pincode || 'N/A',
                country: address?.country || 'N/A'
            };

        const normalizedProducts = products
            .map((item) => ({
                productId: item.productId || item._id || item.id,
                quantity: Number(item.quantity || 1),
                price: Number(item.price || item.unitPrice || 0)
            }))
            .filter((item) => item.productId);

        if (normalizedProducts.length === 0) {
            return res.status(400).json({ message: 'Each product must include a valid product id' });
        }

        const order = await Order.create({
            user: req.user._id,
            products: normalizedProducts,
            totalAmount: Number(totalAmount),
            address: normalizedAddress,
            paymentId
        });

        const message = `Dear ${req.user.name},\n\n Thank you for your order! Your order has been successfully created with the following details:\n\n Order ID: ${order._id} \n Total Amount : $ ${order.totalAmount} \n Shopping Address : ${normalizedAddress.street}\n\n We will notify you once it is shipped.\n\n Best regards,\n ShopNest Team`;

        await sendMail(req.user.email, 'Order Created', message);
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(400).json({ message: error.message || 'Failed to create order' });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('products.productId', 'name price imageURL');
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: "Error fetching orders", error });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.productId', 'name price imageURL');
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: "Error fetching orders", error });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.json({ message: 'Order status updated successfully', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: "Error updating order status", error });
    }
};

module.exports = {
    createOrder,
    myOrders,
    getAllOrders,
    updateOrderStatus
}
