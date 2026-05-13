const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedRestaurants = async () => {
  try {
    await connectDB();

    // Create a sample user first (restaurant owner)
    let user = await User.findOne({ email: 'owner@restaurant.com' });
    if (!user) {
      user = await User.create({
        name: 'Restaurant Owner',
        email: 'owner@restaurant.com',
        password: 'password123',
        role: 'restaurant',
        phone: '1234567890'
      });
    }

    // Clear existing restaurants
    await Restaurant.deleteMany({});

    const sampleRestaurants = [
      {
        owner: user._id,
        name: 'Pizza Palace',
        description: 'Authentic Italian pizzas with fresh ingredients',
        cuisine: ['Italian', 'Fast Food'],
        address: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        phone: '9876543210',
        email: 'pizza@palace.com',
        images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'],
        rating: 4.5,
        totalReviews: 150,
        deliveryTime: '30-45 mins',
        minimumOrder: 200,
        deliveryFee: 40,
        isOpen: true,
        isApproved: true
      },
      {
        owner: user._id,
        name: 'Burger Junction',
        description: 'Juicy burgers and crispy fries',
        cuisine: ['American', 'Fast Food'],
        address: {
          street: '456 Food St',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400002',
          coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        phone: '9876543211',
        email: 'burger@junction.com',
        images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'],
        rating: 4.2,
        totalReviews: 89,
        deliveryTime: '25-35 mins',
        minimumOrder: 150,
        deliveryFee: 30,
        isOpen: true,
        isApproved: true
      },
      {
        owner: user._id,
        name: 'Spice Garden',
        description: 'Traditional Indian cuisine with authentic spices',
        cuisine: ['Indian', 'Vegetarian'],
        address: {
          street: '789 Spice Lane',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400003',
          coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        phone: '9876543212',
        email: 'spice@garden.com',
        images: ['https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400'],
        rating: 4.7,
        totalReviews: 203,
        deliveryTime: '35-50 mins',
        minimumOrder: 250,
        deliveryFee: 50,
        isOpen: true,
        isApproved: true
      }
    ];

    await Restaurant.insertMany(sampleRestaurants);
    console.log('✅ Sample restaurants added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedRestaurants();