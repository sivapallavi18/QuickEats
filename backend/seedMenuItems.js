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

const seedMenuItems = async () => {
  try {
    await connectDB();
    
    // Clear existing menu items
    await Menu.deleteMany({});
    console.log('Cleared existing menu items');
    
    // Get restaurants
    const restaurants = await Restaurant.find({});
    console.log(`Found ${restaurants.length} restaurants`);
    
    const menuItems = [];
    
    // McDonald's menu
    const mcdonalds = restaurants.find(r => r.name === "McDonald's");
    if (mcdonalds) {
      menuItems.push(
        {
          restaurant: mcdonalds._id,
          name: 'Big Mac',
          description: 'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun',
          price: 199,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
          isVeg: false,
          isAvailable: true,
          preparationTime: 12
        },
        {
          restaurant: mcdonalds._id,
          name: 'McChicken',
          description: 'Crispy chicken patty with lettuce and mayo',
          price: 149,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1606755962773-d324e9dabd96?w=400',
          isVeg: false,
          isAvailable: true,
          preparationTime: 10
        },
        {
          restaurant: mcdonalds._id,
          name: 'French Fries',
          description: 'Golden crispy fries',
          price: 89,
          category: 'Snack',
          image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400',
          isVeg: true,
          isAvailable: true,
          preparationTime: 7
        }
      );
    }
    
    // Domino's menu
    const dominos = restaurants.find(r => r.name === "Domino's Pizza");
    if (dominos) {
      menuItems.push(
        {
          restaurant: dominos._id,
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella cheese and basil',
          price: 299,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
          isVeg: true,
          isAvailable: true,
          preparationTime: 22
        },
        {
          restaurant: dominos._id,
          name: 'Pepperoni Pizza',
          description: 'Pizza topped with pepperoni and mozzarella cheese',
          price: 399,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
          isVeg: false,
          isAvailable: true,
          preparationTime: 22
        },
        {
          restaurant: dominos._id,
          name: 'Garlic Bread',
          description: 'Freshly baked bread with garlic and herbs',
          price: 149,
          category: 'Appetizer',
          image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400',
          isVeg: true,
          isAvailable: true,
          preparationTime: 12
        }
      );
    }
    
    // KFC menu
    const kfc = restaurants.find(r => r.name === 'KFC');
    if (kfc) {
      menuItems.push(
        {
          restaurant: kfc._id,
          name: 'Original Recipe Chicken',
          description: 'Crispy fried chicken with 11 herbs and spices',
          price: 249,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
          isVeg: false,
          isAvailable: true,
          preparationTime: 17
        },
        {
          restaurant: kfc._id,
          name: 'Zinger Burger',
          description: 'Spicy chicken fillet burger',
          price: 199,
          category: 'Main Course',
          image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
          isVeg: false,
          isAvailable: true,
          preparationTime: 15
        }
      );
    }
    
    // Insert menu items
    const result = await Menu.insertMany(menuItems);
    console.log(`✅ Successfully seeded ${result.length} menu items`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu items:', error);
    process.exit(1);
  }
};

seedMenuItems();