const order = require('../model/order');
const user = require('../model/user');
const product = require('../model/ecoProduct');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await user.countDocuments({ role: 'user' });
        const totalOrders = await order.countDocuments({});
        const totalProducts = await product.countDocuments({});

        const orders = await order.find({});
        const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenueData
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching status', error });
    }
}

module.exports = { getAdminStats };