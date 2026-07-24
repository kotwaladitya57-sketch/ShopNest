const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(cors(
    {
        origin: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            process.env.FRONTEND_URL
        ],
        meathods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/eco-products', require('./routes/ecoProductRoutes'))
app.use('/api/orders', require('./routes/orderRoutes.js'))
app.use('/api/payment', require('./routes/paymentRoutes'))
app.use('/api/analytics', require('./routes/analyticsRoutes'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.use((req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('ShopNest API is running in Development mode...');
    });
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
