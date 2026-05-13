const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const addMoreMenuItems = async () => {
  try {
    await connectDB();
    
    const restaurants = await Restaurant.find({});
    const menuItems = [];
    
    // Pizza Hut menu
    const pizzaHut = restaurants.find(r => r.name === 'Pizza Hut');
    if (pizzaHut) {
      menuItems.push(
        {
          restaurant: pizzaHut._id,
          name: 'Chicken Supreme Pizza',
          description: 'Loaded with chicken, pepperoni, mushrooms, and bell peppers',
          price: 449,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
          isVeg: false,
          isAvailable: true,
          preparationTime: 25
        },
        {
          restaurant: pizzaHut._id,
          name: 'Cheese Burst Pizza',
          description: 'Pizza with cheese-filled crust and extra mozzarella',
          price: 399,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
          isVeg: true,
          isAvailable: true,
          preparationTime: 22
        }
      );
    }
    
    // Subway menu
    const subway = restaurants.find(r => r.name === 'Subway');
    if (subway) {
      menuItems.push(
        {
          restaurant: subway._id,
          name: 'Italian BMT Sub',
          description: 'Salami, pepperoni, and ham with fresh vegetables',
          price: 249,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400&h=300&fit=crop',
          isVeg: false,
          isAvailable: true,
          preparationTime: 8
        },
        {
          restaurant: subway._id,
          name: 'Veggie Delite Sub',
          description: 'Fresh vegetables with your choice of sauce',
          price: 199,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop',
          isVeg: true,
          isAvailable: true,
          preparationTime: 6
        }
      );
    }
    
    // Taco Bell menu
    const tacoBell = restaurants.find(r => r.name === 'Taco Bell');
    if (tacoBell) {
      menuItems.push(
        {
          restaurant: tacoBell._id,
          name: 'Crunchy Taco Supreme',
          description: 'Seasoned beef, lettuce, tomatoes, cheese, and sour cream',
          price: 149,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=400&h=300&fit=crop',
          isVeg: false,
          isAvailable: true,
          preparationTime: 10
        },
        {
          restaurant: tacoBell._id,
          name: 'Bean Burrito',
          description: 'Refried beans, cheese, and red sauce wrapped in a tortilla',
          price: 129,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop',
          isVeg: true,
          isAvailable: true,
          preparationTime: 8
        },
        {
          restaurant: tacoBell._id,
          name: 'Nachos Supreme',
          description: 'Crispy nachos with cheese, beans, and jalapeños',
          price: 179,
          category: 'Snack',
          image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop',
          isVeg: true,
          isAvailable: true,
          preparationTime: 12
        }
      );
    }
    
    // Add beverages for all restaurants
    const beverages = [
      {
        name: 'Coca Cola',
        description: 'Refreshing cola drink',
        price: 49,
        category: 'Beverage',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
        isVeg: true,
        isAvailable: true,
        preparationTime: 2
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 79,
        category: 'Beverage',
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
        isVeg: true,
        isAvailable: true,
        preparationTime: 3
      }
    ];
    
    // Add beverages to McDonald's, KFC, and Domino's
    const mainRestaurants = restaurants.filter(r => 
      ['McDonald\'s', 'KFC', 'Domino\'s Pizza'].includes(r.name)
    );
    
    mainRestaurants.forEach(restaurant => {
      beverages.forEach(beverage => {
        menuItems.push({
          ...beverage,
          restaurant: restaurant._id
        });
      });
    });
    
    const result = await Menu.insertMany(menuItems);
    console.log(`✅ Successfully added ${result.length} new menu items`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding menu items:', error);
    process.exit(1);
  }
};

addMoreMenuItems();