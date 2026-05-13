const mongoose = require('mongoose');
const RestaurantLocation = require('./models/RestaurantLocation');
const Menu = require('./models/Menu');
require('dotenv').config();

const seedCompleteData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await RestaurantLocation.deleteMany({});
    await Menu.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create restaurants with menu items
    const restaurants = [
      {
        name: "Spice Garden Mumbai",
        address: {
          street: "123 MG Road",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India"
        },
        location: {
          type: "Point",
          coordinates: [72.8777, 19.0760]
        },
        cuisine: ["Indian", "North Indian", "Vegetarian"],
        rating: 4.5,
        deliveryTime: "25-35 min",
        minimumOrder: 150,
        deliveryFee: 25,
        phone: "+91 22 1234 5678",
        email: "spicegarden@example.com",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
        menuItems: [
          {
            name: "Butter Chicken",
            description: "Creamy tomato-based curry with tender chicken",
            category: "Main Course",
            price: 280,
            image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400",
            isVeg: false,
            isAvailable: true,
            preparationTime: 20
          },
          {
            name: "Paneer Tikka",
            description: "Grilled cottage cheese with spices",
            category: "Appetizer",
            price: 220,
            image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
            isVeg: true,
            isAvailable: true,
            preparationTime: 15
          }
        ]
      },
      {
        name: "Pizza Corner",
        address: {
          street: "456 Linking Road",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400050",
          country: "India"
        },
        location: {
          type: "Point",
          coordinates: [72.8295, 19.0596]
        },
        cuisine: ["Italian", "Pizza", "Fast Food"],
        rating: 4.2,
        deliveryTime: "20-30 min",
        minimumOrder: 200,
        deliveryFee: 30,
        phone: "+91 22 2345 6789",
        email: "pizzacorner@example.com",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
        menuItems: [
          {
            name: "Margherita Pizza",
            description: "Classic pizza with tomato sauce and mozzarella",
            category: "Main Course",
            price: 320,
            image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
            isVeg: true,
            isAvailable: true,
            preparationTime: 18
          },
          {
            name: "Pepperoni Pizza",
            description: "Pizza topped with pepperoni and cheese",
            category: "Main Course",
            price: 420,
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
            isVeg: false,
            isAvailable: true,
            preparationTime: 18
          }
        ]
      }
    ];

    let totalMenuItems = 0;

    for (const restaurantData of restaurants) {
      // Extract menu items
      const menuItems = restaurantData.menuItems;
      delete restaurantData.menuItems;

      // Create restaurant
      const restaurant = await RestaurantLocation.create(restaurantData);
      console.log(`✅ Created restaurant: ${restaurant.name}`);

      // Create menu items for this restaurant
      if (menuItems && menuItems.length > 0) {
        const menuItemsWithRestaurant = menuItems.map(item => ({
          ...item,
          restaurant: restaurant._id
        }));

        await Menu.insertMany(menuItemsWithRestaurant);
        totalMenuItems += menuItemsWithRestaurant.length;
        console.log(`   📋 Added ${menuItemsWithRestaurant.length} menu items`);
      }
    }

    console.log(`\n🎉 Successfully created ${restaurants.length} restaurants and ${totalMenuItems} menu items`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

if (require.main === module) {
  seedCompleteData();
}

module.exports = { seedCompleteData };