# QuickEats - MERN Stack Food Delivery App

A full-stack food delivery application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Authentication**: Register, login, and secure user sessions
- **Restaurant Browsing**: View restaurants and their menus
- **Cart Management**: Add items to cart and manage orders
- **Order Tracking**: Real-time order status updates
- **Delivery System**: Delivery dashboard for drivers
- **Payment Integration**: Secure checkout process
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- React.js
- React Router
- Bootstrap
- React Toastify
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

## Project Structure

```
quickseat/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── utils/          # Helper functions
├── src/
│   ├── components/     # Reusable React components
│   ├── context/        # React Context providers
│   ├── pages/          # Page components
│   ├── services/       # API services
│   └── utils/          # Utility functions
└── public/             # Static assets
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the root directory:
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Available Scripts

### Frontend
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

### Backend
- `npm start` - Starts the server
- `npm run dev` - Starts the server with nodemon (if configured)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID

### Menu
- `GET /api/menu/:restaurantId` - Get menu items for a restaurant

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Delivery
- `GET /api/delivery/orders` - Get delivery orders
- `PUT /api/delivery/orders/:id` - Update order status

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Meghana - [GitHub](https://github.com/Meghana-564)

Project Link: [https://github.com/Meghana-564/Quickeats-mern](https://github.com/Meghana-564/Quickeats-mern)