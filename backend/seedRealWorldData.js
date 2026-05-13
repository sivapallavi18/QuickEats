const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');
const User = require('./models/User');
require('dotenv').config();

const realWorldRestaurants = [
  {
    name: "McDonald's",
    description: "World's largest chain of hamburger fast food restaurants",
    cuisine: ["Fast Food", "American", "Burgers"],
    address: {
      street: "Phoenix MarketCity Mall",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400051",
      coordinates: { lat: 19.0876, lng: 72.8905 }
    },
    phone: "+91 22 6671 7000",
    email: "info@mcdonalds.co.in",
    rating: 4.2,
    deliveryTime: "25-35 min",
    deliveryFee: 29,
    minimumOrder: 149,
    images: [
      "https://images.unsplash.com/photo-1552566090-a4c64d4dc4c0?w=800",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800"
    ],
    isActive: true,
    openingHours: {
      monday: { open: "07:00", close: "23:00" },
      tuesday: { open: "07:00", close: "23:00" },
      wednesday: { open: "07:00", close: "23:00" },
      thursday: { open: "07:00", close: "23:00" },
      friday: { open: "07:00", close: "23:00" },
      saturday: { open: "07:00", close: "23:00" },
      sunday: { open: "07:00", close: "23:00" }
    }
  },
  {
    name: "Domino's Pizza",
    description: "American multinational pizza restaurant chain",
    cuisine: ["Pizza", "Italian", "Fast Food"],
    address: {
      street: "Linking Road, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400050",
      coordinates: { lat: 19.0596, lng: 72.8295 }
    },
    phone: "+91 22 2640 4444",
    email: "info@dominos.co.in",
    rating: 4.1,
    deliveryTime: "30-40 min",
    deliveryFee: 25,
    minimumOrder: 199,
    images: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800"
    ],
    isActive: true
  },
  {
    name: "KFC",
    description: "American fast food restaurant chain specializing in fried chicken",
    cuisine: ["Fast Food", "American", "Chicken"],
    address: {
      street: "Palladium Mall, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400013",
      coordinates: { lat: 19.0095, lng: 72.8295 }
    },
    phone: "+91 22 4097 6000",
    email: "info@kfc.co.in",
    rating: 4.0,
    deliveryTime: "20-30 min",
    deliveryFee: 35,
    minimumOrder: 179,
    images: [
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800",
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=800"
    ],
    isActive: true
  },
  {
    name: "Subway",
    description: "American fast food restaurant franchise that primarily sells submarine sandwiches",
    cuisine: ["Fast Food", "Sandwiches", "Healthy"],
    address: {
      street: "Inorbit Mall, Malad West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400064",
      coordinates: { lat: 19.1868, lng: 72.8347 }
    },
    phone: "+91 22 2881 4000",
    email: "info@subway.co.in",
    rating: 4.3,
    deliveryTime: "15-25 min",
    deliveryFee: 20,
    minimumOrder: 129,
    images: [
      "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800",
      "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800"
    ],
    isActive: true
  },
  {
    name: "Pizza Hut",
    description: "American restaurant chain and international franchise known for pizza",
    cuisine: ["Pizza", "Italian", "Fast Food"],
    address: {
      street: "R City Mall, Ghatkopar West",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400086",
      coordinates: { lat: 19.0863, lng: 72.9081 }
    },
    phone: "+91 22 4242 4242",
    email: "info@pizzahut.co.in",
    rating: 4.0,
    deliveryTime: "35-45 min",
    deliveryFee: 30,
    minimumOrder: 249,
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800"
    ],
    isActive: true
  },
  {
    name: "Taco Bell",
    description: "American chain of fast food restaurants serving Mexican-inspired foods",
    cuisine: ["Mexican", "Fast Food", "Tex-Mex"],
    address: {
      street: "High Street Phoenix, Lower Parel",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400013",
      coordinates: { lat: 19.0134, lng: 72.8302 }
    },
    phone: "+91 22 6671 8000",
    email: "info@tacobell.co.in",
    rating: 4.1,
    deliveryTime: "25-35 min",
    deliveryFee: 25,
    minimumOrder: 199,
    images: [
      "https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=800",
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800"
    ],
    isActive: true
  }
];

const realWorldMenus = {
  "McDonald's": [
    {
      name: "Big Mac",
      description: "Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun",
      price: 199,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 8,
      ingredients: ["Beef Patty", "Special Sauce", "Lettuce", "Cheese", "Pickles", "Onions", "Sesame Bun"]
    },
    {
      name: "McChicken",
      description: "Crispy chicken patty with lettuce and mayo in a sesame seed bun",
      price: 149,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1606755962773-d324e9dabd96?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 6
    },
    {
      name: "McVeggie",
      description: "Vegetarian patty with lettuce, tomato, and mayo",
      price: 129,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 6
    },
    {
      name: "French Fries (Medium)",
      description: "Golden, crispy french fries",
      price: 89,
      category: "Snack",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 3
    },
    {
      name: "Chicken McNuggets (6 pcs)",
      description: "Tender chicken pieces in crispy coating",
      price: 159,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 5
    },
    {
      name: "McFlurry Oreo",
      description: "Vanilla soft serve with Oreo cookie pieces",
      price: 99,
      category: "Dessert",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 2
    }
  ],
  "Domino's Pizza": [
    {
      name: "Margherita Pizza (Medium)",
      description: "Classic pizza with tomato sauce, mozzarella cheese and fresh basil",
      price: 299,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 15
    },
    {
      name: "Pepperoni Pizza (Medium)",
      description: "Pepperoni with mozzarella cheese and tomato sauce",
      price: 399,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 15
    },
    {
      name: "Chicken Dominator",
      description: "Loaded with grilled chicken, pepperoni, and Italian sausage",
      price: 549,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 18
    },
    {
      name: "Garlic Bread",
      description: "Freshly baked bread with garlic and herbs",
      price: 129,
      category: "Snack",
      image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 8
    },
    {
      name: "Choco Lava Cake",
      description: "Warm chocolate cake with molten chocolate center",
      price: 99,
      category: "Dessert",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 5
    }
  ],
  "KFC": [
    {
      name: "Original Recipe Chicken (2 pcs)",
      description: "Colonel's secret blend of 11 herbs and spices",
      price: 199,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 12
    },
    {
      name: "Zinger Burger",
      description: "Spicy chicken fillet with lettuce and mayo",
      price: 179,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1606755962773-d324e9dabd96?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 8
    },
    {
      name: "Hot & Crispy Chicken (1 pc)",
      description: "Crispy fried chicken with spicy coating",
      price: 119,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 10
    },
    {
      name: "Popcorn Chicken (Regular)",
      description: "Bite-sized pieces of tender chicken",
      price: 149,
      category: "Snack",
      image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 6
    },
    {
      name: "Coleslaw (Regular)",
      description: "Fresh cabbage and carrot salad",
      price: 69,
      category: "Snack",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 2
    }
  ],
  "Subway": [
    {
      name: "Italian B.M.T. (6 inch)",
      description: "Pepperoni, salami, and ham with cheese and veggies",
      price: 189,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 5
    },
    {
      name: "Veggie Delite (6 inch)",
      description: "Fresh vegetables with cheese on your choice of bread",
      price: 139,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 4
    },
    {
      name: "Chicken Teriyaki (6 inch)",
      description: "Grilled chicken with teriyaki sauce and vegetables",
      price: 219,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 6
    },
    {
      name: "Cookies (3 pcs)",
      description: "Freshly baked chocolate chip cookies",
      price: 89,
      category: "Dessert",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 1
    }
  ],
  "Pizza Hut": [
    {
      name: "Supreme Pizza (Medium)",
      description: "Pepperoni, sausage, mushrooms, bell peppers, and onions",
      price: 449,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 20
    },
    {
      name: "Veggie Lovers (Medium)",
      description: "Mushrooms, bell peppers, onions, tomatoes, and olives",
      price: 379,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 18
    },
    {
      name: "Chicken Wings (8 pcs)",
      description: "Spicy buffalo wings with ranch dip",
      price: 299,
      category: "Appetizer",
      image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 12
    },
    {
      name: "Breadsticks",
      description: "Warm breadsticks with marinara sauce",
      price: 149,
      category: "Snack",
      image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 8
    }
  ],
  "Taco Bell": [
    {
      name: "Crunchy Taco Supreme",
      description: "Seasoned beef, lettuce, tomatoes, cheese, and sour cream",
      price: 129,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=400",
      isVeg: false,
      isAvailable: true,
      preparationTime: 4
    },
    {
      name: "Bean Burrito",
      description: "Refried beans, cheese, and red sauce wrapped in a tortilla",
      price: 99,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 5
    },
    {
      name: "Quesadilla",
      description: "Grilled tortilla with melted cheese",
      price: 149,
      category: "Main Course",
      image: "https://images.unsplash.com/photo-1565299585323-38174c4a6471?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 6
    },
    {
      name: "Nachos Supreme",
      description: "Tortilla chips with cheese, beans, tomatoes, and sour cream",
      price: 179,
      category: "Snack",
      image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400",
      isVeg: true,
      isAvailable: true,
      preparationTime: 3
    }
  ]
};

const seedRealWorldData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    console.log('Cleared existing data');

    // Create or find restaurant owner
    let restaurantOwner = await User.findOne({ email: 'owner@restaurants.com' });
    if (!restaurantOwner) {
      restaurantOwner = new User({
        name: 'Restaurant Owner',
        email: 'owner@restaurants.com',
        password: 'password123',
        role: 'restaurant',
        phone: '+91 9999999999'
      });
      await restaurantOwner.save();
      console.log('Created restaurant owner');
    } else {
      console.log('Using existing restaurant owner');
    }

    // Add owner to all restaurants
    const restaurantsWithOwner = realWorldRestaurants.map(restaurant => ({
      ...restaurant,
      owner: restaurantOwner._id,
      isApproved: true
    }));

    // Insert restaurants
    const insertedRestaurants = await Restaurant.insertMany(restaurantsWithOwner);
    console.log(`Inserted ${insertedRestaurants.length} restaurants`);

    // Insert menus for each restaurant
    let totalMenuItems = 0;
    for (const restaurant of insertedRestaurants) {
      const menuItems = realWorldMenus[restaurant.name];
      if (menuItems) {
        const menuItemsWithRestaurant = menuItems.map(item => ({
          ...item,
          restaurant: restaurant._id
        }));
        
        await Menu.insertMany(menuItemsWithRestaurant);
        totalMenuItems += menuItemsWithRestaurant.length;
      }
    }

    console.log(`Inserted ${totalMenuItems} menu items`);
    console.log('Real-world data seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

if (require.main === module) {
  seedRealWorldData();
}

module.exports = { seedRealWorldData };