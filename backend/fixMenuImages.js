const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/Menu');

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

const fixMenuImages = async () => {
  try {
    await connectDB();

    const imageUpdates = [
      { name: 'Margherita Pizza', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop' },
      { name: 'Pepperoni Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop' },
      { name: 'Garlic Bread', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop' },
      { name: 'Caesar Salad', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
      { name: 'Tiramisu', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop' },
      { name: 'Coca Cola', image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop' },
      
      { name: 'Classic Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
      { name: 'Veggie Burger', image: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=400&h=300&fit=crop' },
      { name: 'Chicken Wings', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop' },
      { name: 'French Fries', image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop' },
      { name: 'Chocolate Shake', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop' },
      { name: 'Apple Pie', image: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=400&h=300&fit=crop' },
      
      { name: 'Butter Chicken', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop' },
      { name: 'Paneer Tikka', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop' },
      { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop' },
      { name: 'Dal Tadka', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
      { name: 'Naan Bread', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
      { name: 'Samosa', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
      { name: 'Gulab Jamun', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
      { name: 'Mango Lassi', image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop' }
    ];

    for (const update of imageUpdates) {
      await MenuItem.updateOne(
        { name: update.name },
        { $set: { image: update.image } }
      );
    }

    console.log('✅ Menu images updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating images:', error);
    process.exit(1);
  }
};

fixMenuImages();