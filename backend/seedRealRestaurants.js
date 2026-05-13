const mongoose = require('mongoose');
const RestaurantLocation = require('./models/RestaurantLocation');
const Menu = require('./models/Menu');
require('dotenv').config();

// Real restaurant chains with actual locations
const realRestaurants = [
  {
    name: "McDonald's - Bandra West",
    address: {
      street: "Linking Road, Near Bandra Station",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      country: "India"
    },
    location: {
      type: "Point",
      coordinates: [72.8295, 19.0596] // Bandra West
    },
    cuisine: ["Fast Food", "American", "Burgers"],
    rating: 4.2,
    deliveryTime: "20-30 min",
    minimumOrder: 149,
    deliveryFee: 29,
    phone: "+91 22 2640 4444",
    email: "bandra@mcdonalds.co.in",
    image: "https://images.unsplash.com/photo-1552566090-a4c64d4dc4c0?w=400",
    menuItems: [
      {
        name: "Big Mac",
        description: "Two beef patties, special sauce, lettuce, cheese, pickles, onions",
        category: "Main Course",
        price: 199,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        isVeg: false,
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: "McVeggie Burger",
        description: "Vegetarian patty with lettuce and mayo",
        category: "Main Course", 
        price: 129,
        image: "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400",
        isVeg: true,
        isAvailable: true,
        preparationTime: 6
      },
      {
        name: "French Fries (Medium)",
        description: "Golden crispy french fries",
        category: "Snack",
        price: 89,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
        isVeg: true,
        isAvailable: true,
        preparationTime: 3
      }
    ]
  },
  {
    name: "Domino's Pizza - Andheri West",
    address: {
      street: "SV Road, Near Andheri Station",
      city: "Mumbai", 
      state: "Maharashtra",
      zipCode: "400058",
      country: "India"
    },
    location: {
      type: "Point",
      coordinates: [72.8406, 19.1197] // Andheri West
    },
    cuisine: ["Pizza", "Italian", "Fast Food"],
    rating: 4.1,
    deliveryTime: "25-35 min",
    minimumOrder: 199,
    deliveryFee: 25,
    phone: "+91 22 2673 3333",
    email: "andheri@dominos.co.in",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    menuItems: [
      {
        name: "Margherita Pizza (Medium)",
        description: "Classic pizza with tomato sauce and mozzarella cheese",
        category: "Main Course",
        price: 299,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        isVeg: true,
        isAvailable: true,
        preparationTime: 15
      },
      {
        name: "Pepperoni Pizza (Medium)",
        description: "Pepperoni with mozzarella cheese",
        category: "Main Course",
        price: 399,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        isVeg: false,
        isAvailable: true,
        preparationTime: 15
      }
    ]
  },
  {
    name: "KFC - Powai",
    address: {
      street: "Hiranandani Gardens, Powai",
      city: "Mumbai",
      state: "Maharashtra", 
      zipCode: "400076",
      country: "India"
    },
    location: {
      type: "Point",
      coordinates: [72.9060, 19.1176] // Powai
    },
    cuisine: ["Fast Food", "Chicken", "American"],
    rating: 4.0,
    deliveryTime: "20-30 min",
    minimumOrder: 179,
    deliveryFee: 35,
    phone: "+91 22 2570 4000",
    email: "powai@kfc.co.in", 
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
    menuItems: [
      {
        name: "Zinger Burger",
        description: "Spicy chicken fillet with lettuce and mayo",
        category: "Main Course",
        price: 179,
        image: "https://images.unsplash.com/photo-1606755962773-d324e9dabd96?w=400",
        isVeg: false,
        isAvailable: true,
        preparationTime: 8
      },
      {
        name: "Hot & Crispy Chicken (2 pcs)",
        description: "Crispy fried chicken with spicy coating",
        category: "Main Course",
        price: 199,
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
        isVeg: false,
        isAvailable: true,
        preparationTime: 10
      }
    ]
  },
  {
    name: "Subway - Lower Parel",
    address: {
      street: "High Street Phoenix Mall, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400013", 
      country: "India"
    },
    location: {
      type: "Point",
      coordinates: [72.8302, 19.0134] // Lower Parel
    },
    cuisine: ["Sandwiches", "Healthy", "Fast Food"],
    rating: 4.3,
    deliveryTime: "15-25 min",
    minimumOrder: 129,
    deliveryFee: 20,
    phone: "+91 22 6671 8000",
    email: "lowerparel@subway.co.in",
    image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400",
    menuItems: [
      {
        name: "Veggie Delite (6 inch)",
        description: "Fresh vegetables with cheese on your choice of bread",
        category: "Main Course",
        price: 139,
        image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400",
        isVeg: true,
        isAvailable: true,
        preparationTime: 4
      },
      {
        name: "Chicken Teriyaki (6 inch)",
        description: "Grilled chicken with teriyaki sauce",
        category: "Main Course",
        price: 219,
        image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400",
        isVeg: false,
        isAvailable: true,
        preparationTime: 6
      }
    ]
  },
  {
    name: "Starbucks - BKC",
    address: {
      street: "Bandra Kurla Complex, G Block",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400051",
      country: "India"
    },
    location: {
      type: "Point", 
      coordinates: [72.8697, 19.0728] // BKC
    },
    cuisine: ["Coffee", "Cafe", "Beverages", "Desserts"],
    rating: 4.4,
    deliveryTime: "15-25 min",
    minimumOrder: 100,
    deliveryFee: 15,
    phone: "+91 22 6742 8000",
    email: "bkc@starbucks.co.in",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    menuItems: [
      {
        name: "Cappuccino (Tall)",
        description: "Rich espresso with steamed milk and foam",
        category: "Beverage",
        price: 195,
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
        isVeg: true,
        isAvailable: true,
        preparationTime: 3
      },
      {
        name: "Chocolate Croissant",
        description: "Buttery croissant filled with chocolate",
        category: "Dessert",
        price: 145,
        image: "https://images.unsplash.com/photo-1555507036-ab794f4afe5b?w=400",
        isVeg: true,
        isAvailable: true,
        preparationTime: 2
      }
    ]
  }
];

const seedRealRestaurants = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await RestaurantLocation.deleteMany({});
    await Menu.deleteMany({});
    console.log('🗑️ Cleared existing data');

    let totalMenuItems = 0;

    for (const restaurantData of realRestaurants) {
      // Extract menu items
      const menuItems = restaurantData.menuItems;
      delete restaurantData.menuItems;

      // Create restaurant
      const restaurant = await RestaurantLocation.create(restaurantData);
      console.log(`✅ Created: ${restaurant.name}`);
      console.log(`   📍 Location: ${restaurant.location.coordinates[1]}, ${restaurant.location.coordinates[0]}`);

      // Create menu items
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

    // Create 2dsphere index
    await RestaurantLocation.collection.createIndex({ location: '2dsphere' });
    console.log('✅ Created geospatial index');

    console.log(`\n🎉 Successfully created ${realRestaurants.length} real restaurants and ${totalMenuItems} menu items`);
    console.log('📍 All restaurants are in Mumbai with real coordinates');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

if (require.main === module) {
  seedRealRestaurants();
}

module.exports = { seedRealRestaurants };