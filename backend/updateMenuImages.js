const mongoose = require('mongoose');
const Menu = require('./models/Menu');
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

const updateMenuImages = async () => {
  try {
    await connectDB();
    
    // Better food images
    const imageUpdates = [
      {
        name: 'Big Mac',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
      },
      {
        name: 'McChicken',
        image: 'https://images.unsplash.com/photo-1606755962773-d324e9dabd96?w=400&h=300&fit=crop'
      },
      {
        name: 'French Fries',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop'
      },
      {
        name: 'Margherita Pizza',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop'
      },
      {
        name: 'Pepperoni Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
      },
      {
        name: 'Garlic Bread',
        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop'
      },
      {
        name: 'Original Recipe Chicken',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop'
      },
      {
        name: 'Zinger Burger',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop'
      }
    ];

    for (const update of imageUpdates) {
      await Menu.updateOne(
        { name: update.name },
        { $set: { image: update.image } }
      );
      console.log(`✅ Updated image for ${update.name}`);
    }

    console.log('✅ All menu item images updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
};

updateMenuImages();