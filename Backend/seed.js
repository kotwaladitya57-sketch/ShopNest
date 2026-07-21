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
    imageURL: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Organic Cotton Tote Bag',
    price: 12.5,
    description: 'Durable organic cotton tote bag for shopping, beach days, and everyday use.',
    category: 'Accessories',
    stock: 75,
    imageURL: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Beeswax Food Wrap Set',
    price: 19.99,
    description: 'Set of reusable beeswax wraps for storing food without plastic.',
    category: 'Kitchen',
    stock: 50,
    imageURL: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Stainless Steel Water Bottle',
    price: 22.0,
    description: 'Insulated stainless steel bottle to keep drinks cold or hot for hours.',
    category: 'Home & Living',
    stock: 90,
    imageURL: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Eco-Friendly Dish Brush',
    price: 8.75,
    description: 'Wooden dish brush with replaceable coconut fiber head.',
    category: 'Kitchen',
    stock: 60,
    imageURL: 'https://images.unsplash.com/photo-1560185127-6d9ba1aaf97c?auto=format&fit=crop&w=800&q=80',
  },
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
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

seedDatabase();