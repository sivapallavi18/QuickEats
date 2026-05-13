const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/Menu');
const Restaurant = require('./models/Restaurant');

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

const seedMoreMenu = async () => {
  try {
    await connectDB();

    const restaurants = await Restaurant.find();
    if (restaurants.length === 0) {
      console.log('No restaurants found. Please run seedData.js first.');
      process.exit(1);
    }

    await MenuItem.deleteMany({});

    const menuItems = [
      // Pizza Palace Menu (8 items)
      {
        restaurant: restaurants[0]._id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 299,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300',
        isVeg: true,
        preparationTime: 20,
        isAvailable: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Pepperoni Pizza',
        description: 'Delicious pizza topped with pepperoni and cheese',
        price: 399,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
        isVeg: false,
        preparationTime: 25,
        isAvailable: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Garlic Bread',
        description: 'Crispy bread with garlic butter and herbs',
        price: 149,
        category: 'Appetizer',
        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300',
        isVeg: true,
        preparationTime: 10,
        isAvailable: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with caesar dressing',
        price: 199,
        category: 'Appetizer',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
        isVeg: true,
        preparationTime: 8,
        isAvailable: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee and mascarpone',
        price: 179,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300',
        isVeg: true,
        preparationTime: 5,
        isAvailable: true
      },
      {
        restaurant: restaurants[0]._id,
        name: 'Coca Cola',
        description: 'Chilled soft drink',
        price: 49,
        category: 'Beverage',
        image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300',
        isVeg: true,
        preparationTime: 2,
        isAvailable: true
      },
      
      // Burger Junction Menu (6 items)
      {
        restaurant: restaurants[1]._id,
        name: 'Classic Burger',
        description: 'Juicy beef patty with lettuce, tomato, and special sauce',
        price: 199,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
        isVeg: false,
        preparationTime: 15,
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables',
        price: 179,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=300',
        isVeg: true,
        preparationTime: 12,
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Chicken Wings',
        description: 'Spicy buffalo wings with ranch dip',
        price: 249,
        category: 'Appetizer',
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300',
        isVeg: false,
        preparationTime: 18,
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'French Fries',
        description: 'Crispy golden fries with ketchup',
        price: 99,
        category: 'Snack',
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300',
        isVeg: true,
        preparationTime: 8,
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Chocolate Shake',
        description: 'Rich chocolate milkshake with whipped cream',
        price: 129,
        category: 'Beverage',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300',
        isVeg: true,
        preparationTime: 5,
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: 'Apple Pie',
        description: 'Warm apple pie with vanilla ice cream',
        price: 149,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=300',
        isVeg: true,
        preparationTime: 10,
        isAvailable: true
      },
      
      // Spice Garden Menu (8 items)
      {
        restaurant: restaurants[2]._id,
        name: 'Butter Chicken',
        description: 'Creamy tomato-based curry with tender chicken pieces',
        price: 249,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300',
        isVeg: false,
        preparationTime: 30,
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Paneer Tikka',
        description: 'Grilled cottage cheese with aromatic spices',
        price: 199,
        category: 'Appetizer',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300',
        isVeg: true,
        preparationTime: 20,
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Biryani',
        description: 'Fragrant basmati rice with spiced chicken',
        price: 299,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300',
        isVeg: false,
        preparationTime: 35,
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Dal Tadka',
        description: 'Yellow lentils tempered with spices',
        price: 149,
        category: 'Main Course',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300',
        isVeg: true,
        preparationTime: 25,
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Naan Bread',
        description: 'Soft Indian bread baked in tandoor',
        price: 49,
        category: 'Snack',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
        isVeg: true,
        preparationTime: 10,
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes',
        price: 79,
        category: 'Appetizer',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300',
        isVeg: true,
        preparationTime: 12,
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in sugar syrup',
        price: 99,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
        isVeg: true,
        preparationTime: 5,
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: 'Mango Lassi',
        description: 'Refreshing yogurt drink with mango',
        price: 89,
        category: 'Beverage',
        image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300',
        isVeg: true,
        preparationTime: 5,
        isAvailable: true
      }
    ];

    await MenuItem.insertMany(menuItems);
    console.log('✅ Complete menu items added successfully!');
    console.log(`Added ${menuItems.length} menu items across ${restaurants.length} restaurants`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu:', error);
    process.exit(1);
  }
};

seedMoreMenu();