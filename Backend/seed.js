const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./model/user');
const EcoProduct = require('./model/ecoProduct');

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/shopnest';

const dummyUsers = [
  {
    name: 'Aditya Sharma',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
    verifyed: true,
  },
  {
    name: 'Nina Patel',
    email: 'nina@example.com',
    password: 'User123!',
    role: 'user',
    verifyed: true,
  },
  {
    name: 'Rahul Singh',
    email: 'rahul@example.com',
    password: 'User456!',
    role: 'user',
    verifyed: false,
  },
];

const dummyProducts = [
  {
    name: 'Reusable Bamboo Toothbrush',
    price: 4.99,
    description: 'A sustainable bamboo toothbrush with soft bristles and compostable handle.',
    category: 'Personal Care',
    stock: 120,
    imageURL: 'https://web.tradekorea.com/product/879/2243879/OEM_eco_friendly_bamboo_toothbrush_biodegradable_reusable_with_soft_bristle_4.jpg',
  },
  {
    name: 'Organic Cotton Tote Bag',
    price: 12.5,
    description: 'Durable organic cotton tote bag for shopping, beach days, and everyday use.',
    category: 'Accessories',
    stock: 75,
    imageURL: 'https://totebagfactory.com/cdn/shop/collections/Organic_Cotton_Tote_Bags.jpg?crop=center&height=1200&v=1555140910&width=1200',
  },
  {
    name: 'Beeswax Food Wrap Set',
    price: 19.99,
    description: 'Set of reusable beeswax wraps for storing food without plastic.',
    category: 'Kitchen',
    stock: 50,
    imageURL: 'https://m.media-amazon.com/images/I/91KaYM3XpdL._AC_.jpg',
  },
  {
    name: 'Stainless Steel Water Bottle',
    price: 22.0,
    description: 'Insulated stainless steel bottle to keep drinks cold or hot for hours.',
    category: 'Home & Living',
    stock: 90,
    imageURL: 'https://m.media-amazon.com/images/I/71tVlzCfUML._AC_SL1500_.jpg',
  },
  {
    name: 'Eco-Friendly Dish Brush',
    price: 8.75,
    description: 'Wooden dish brush with replaceable coconut fiber head.',
    category: 'Kitchen',
    stock: 60,
    imageURL: 'https://jungleculture.eco/cdn/shop/products/eco-friendly-dish-brushes_2048x.jpg?v=1681135573',
  },
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immersive sound experience with advanced active noise cancellation.',
    price: 299.99,
    category: 'Electronics',
    stock: 15,
    imageURL: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ratings: 4.8,
    numReviews: 24
  },
  {
    name: 'Minimalist Modern Chair',
    description: 'A stylish and comfortable addition to any contemporary living room.',
    price: 150.00,
    category: 'Furniture',
    stock: 30,
    imageURL: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ratings: 4.2,
    numReviews: 12
  },
  {
    name: 'Professional DSLR Camera',
    description: 'Capture stunning moments with high-resolution clarity and speed.',
    price: 1199.99,
    category: 'Electronics',
    stock: 8,
    imageURL: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ratings: 4.9,
    numReviews: 50
  },
  {
    name: 'Classic White Sneakers',
    description: 'Versatile and comfortable, a staple for any casual outfit.',
    price: 85.00,
    category: 'Clothing',
    stock: 50,
    imageURL: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    ratings: 4.5,
    numReviews: 89
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`MongoDB connected for seeding: ${mongoose.connection.host}/${mongoose.connection.name}`);

    await User.deleteMany({});
    await EcoProduct.deleteMany({});
    console.log('Cleared existing data');

    const usersWithHashedPassword = await Promise.all(
      dummyUsers.map(async (userData) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        return {
          ...userData,
          password: hashedPassword,
        };
      })
    );

    const createdUsers = await User.insertMany(usersWithHashedPassword);
    const createdProducts = await EcoProduct.insertMany(dummyProducts);

    console.log(`Seeded ${createdUsers.length} users and ${createdProducts.length} products`);
    console.log('\nDatabase seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@example.com / Admin123!');
    console.log('User: nina@example.com / User123!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect().catch(() => { });
    process.exit(1);
  }
};

seedDatabase();