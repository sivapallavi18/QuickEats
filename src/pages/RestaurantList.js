import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { toast } from 'react-toastify';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: '',
    minRating: ''
  });
  


  useEffect(() => {
    fetchRestaurants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);



  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.cuisine) params.cuisine = filters.cuisine;
      if (filters.minRating) params.minRating = filters.minRating;
      
      const response = await restaurantAPI.getAll(params);
      let restaurantData = response.data.data || response.data || [];
      
      // Client-side filtering as fallback
      if (restaurantData.length > 0) {
        if (filters.search) {
          restaurantData = restaurantData.filter(restaurant => 
            restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            restaurant.cuisine?.some(c => c.toLowerCase().includes(filters.search.toLowerCase()))
          );
        }
        if (filters.cuisine) {
          restaurantData = restaurantData.filter(restaurant => 
            restaurant.cuisine?.includes(filters.cuisine)
          );
        }
        if (filters.minRating) {
          restaurantData = restaurantData.filter(restaurant => 
            restaurant.rating >= parseFloat(filters.minRating)
          );
        }
      }
      
      setRestaurants(restaurantData);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // Location-based sample restaurants
      const sampleRestaurants = [
        // Downtown Area
        {
          _id: 'downtown1',
          name: 'Pizza Palace Downtown',
          description: 'Authentic Italian pizzas with fresh ingredients in the heart of the city',
          cuisine: ['Italian', 'Fast Food'],
          rating: 4.5,
          totalReviews: 320,
          deliveryTime: '20-30 min',
          minimumOrder: 200,
          deliveryFee: 30,
          location: 'Downtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2QjZCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NlSBQaXp6YTwvdGV4dD48L3N2Zz4=']
        },
        {
          _id: 'downtown2',
          name: 'Spice Route',
          description: 'Premium Indian cuisine with traditional recipes',
          cuisine: ['Indian'],
          rating: 4.7,
          totalReviews: 245,
          deliveryTime: '25-35 min',
          minimumOrder: 300,
          deliveryFee: 35,
          location: 'Downtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY4QzQyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NmyBTcGljZTwvdGV4dD48L3N2Zz4=']
        },
        {
          _id: 'downtown3',
          name: 'Golden Dragon',
          description: 'Authentic Chinese cuisine with modern presentation',
          cuisine: ['Chinese', 'Asian'],
          rating: 4.3,
          totalReviews: 189,
          deliveryTime: '20-30 min',
          minimumOrder: 250,
          deliveryFee: 40,
          location: 'Downtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZENzAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+loCBDaGluZXNlPC90ZXh0Pjwvc3ZnPg==']
        },
        // Uptown Area
        {
          _id: 'uptown1',
          name: 'Burger Barn Uptown',
          description: 'Gourmet burgers and craft beer in uptown district',
          cuisine: ['American', 'Fast Food'],
          rating: 4.1,
          totalReviews: 156,
          deliveryTime: '15-25 min',
          minimumOrder: 180,
          deliveryFee: 25,
          location: 'Uptown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDBFMEQwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+UlCBCdXJnZXI8L3RleHQ+PC9zdmc+']
        },
        {
          _id: 'uptown2',
          name: 'Casa Mexico',
          description: 'Vibrant Mexican flavors and fresh guacamole',
          cuisine: ['Mexican'],
          rating: 4.4,
          totalReviews: 203,
          deliveryTime: '25-35 min',
          minimumOrder: 220,
          deliveryFee: 35,
          location: 'Uptown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTFDRjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MriBNZXhpY2FuPC90ZXh0Pjwvc3ZnPg==']
        },
        {
          _id: 'uptown3',
          name: 'Pasta Corner',
          description: 'Handmade Italian pasta and wood-fired pizzas',
          cuisine: ['Italian'],
          rating: 4.6,
          totalReviews: 178,
          deliveryTime: '30-40 min',
          minimumOrder: 280,
          deliveryFee: 40,
          location: 'Uptown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUI1OUI2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NnSBQYXN0YTwvdGV4dD48L3N2Zz4=']
        },
        // Midtown Area
        {
          _id: 'midtown1',
          name: 'Wok Express',
          description: 'Quick Asian fusion with fresh ingredients',
          cuisine: ['Chinese', 'Asian'],
          rating: 3.9,
          totalReviews: 134,
          deliveryTime: '15-25 min',
          minimumOrder: 160,
          deliveryFee: 30,
          location: 'Midtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTc0QzNDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+loCBXb2s8L3RleHQ+PC9zdmc+']
        },
        {
          _id: 'midtown2',
          name: 'Curry House',
          description: 'Aromatic Indian curries and fresh naan bread',
          cuisine: ['Indian'],
          rating: 4.2,
          totalReviews: 167,
          deliveryTime: '25-35 min',
          minimumOrder: 240,
          deliveryFee: 35,
          location: 'Midtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjM5QzEyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NmyBDdXJyeTwvdGV4dD48L3N2Zz4=']
        },
        {
          _id: 'midtown3',
          name: 'Quick Bites',
          description: 'Fast food favorites and healthy options',
          cuisine: ['Fast Food', 'American'],
          rating: 3.7,
          totalReviews: 289,
          deliveryTime: '10-20 min',
          minimumOrder: 120,
          deliveryFee: 25,
          location: 'Midtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzQ5OERCIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NnyBGYXN0PC90ZXh0Pjwvc3ZnPg==']
        },
        // Suburbs
        {
          _id: 'suburb1',
          name: 'Family Pizza',
          description: 'Family-friendly pizzeria with generous portions',
          cuisine: ['Italian', 'Fast Food'],
          rating: 4.0,
          totalReviews: 98,
          deliveryTime: '25-35 min',
          minimumOrder: 200,
          deliveryFee: 45,
          location: 'Suburbs',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkVDQzcxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NlSBGYW1pbHk8L3RleHQ+PC9zdmc+']
        },
        {
          _id: 'suburb2',
          name: 'Taco Bell Express',
          description: 'Quick Mexican food with drive-through convenience',
          cuisine: ['Mexican', 'Fast Food'],
          rating: 3.5,
          totalReviews: 145,
          deliveryTime: '20-30 min',
          minimumOrder: 150,
          deliveryFee: 40,
          location: 'Suburbs',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTY3RTIyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MryBUYWNvPC90ZXh0Pjwvc3ZnPg==']
        },
        {
          _id: 'suburb3',
          name: 'Himalayan Kitchen',
          description: 'Authentic Nepalese and Indian mountain cuisine',
          cuisine: ['Indian', 'Asian'],
          rating: 4.5,
          totalReviews: 87,
          deliveryTime: '35-45 min',
          minimumOrder: 280,
          deliveryFee: 50,
          location: 'Suburbs',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEU0NEFEIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+PlO+4jyBJbmRpYW48L3RleHQ+PC9zdmc+']
        },
        // Additional Downtown Restaurants
        {
          _id: 'downtown4',
          name: 'Sushi Zen',
          description: 'Fresh sushi and Japanese cuisine in downtown',
          cuisine: ['Japanese', 'Asian'],
          rating: 4.8,
          totalReviews: 156,
          deliveryTime: '30-40 min',
          minimumOrder: 350,
          deliveryFee: 35,
          location: 'Downtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2OUI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NoyBTdXNoaTwvdGV4dD48L3N2Zz4=']
        },
        {
          _id: 'downtown5',
          name: 'Steakhouse Prime',
          description: 'Premium steaks and fine dining experience',
          cuisine: ['American'],
          rating: 4.6,
          totalReviews: 89,
          deliveryTime: '40-50 min',
          minimumOrder: 500,
          deliveryFee: 45,
          location: 'Downtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOEI0NTEzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+lqSBTdGVhazwvdGV4dD48L3N2Zz4=']
        },
        {
          _id: 'downtown6',
          name: 'Café Mocha',
          description: 'Coffee, pastries and light breakfast options',
          cuisine: ['Cafe', 'American'],
          rating: 4.2,
          totalReviews: 234,
          deliveryTime: '15-25 min',
          minimumOrder: 100,
          deliveryFee: 25,
          location: 'Downtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRDI2OTFFIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4piVIENhZmU8L3RleHQ+PC9zdmc+']
        },
        // Additional Uptown Restaurants
        {
          _id: 'uptown4',
          name: 'Thai Garden',
          description: 'Authentic Thai flavors with fresh herbs',
          cuisine: ['Thai', 'Asian'],
          rating: 4.4,
          totalReviews: 167,
          deliveryTime: '25-35 min',
          minimumOrder: 240,
          deliveryFee: 35,
          location: 'Uptown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzJDRDMyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MtuKAjyBUaGFpPC90ZXh0Pjwvc3ZnPg==']
        },
        {
          _id: 'uptown5',
          name: 'Mediterranean Delight',
          description: 'Fresh Mediterranean dishes and healthy options',
          cuisine: ['Mediterranean'],
          rating: 4.5,
          totalReviews: 123,
          deliveryTime: '30-40 min',
          minimumOrder: 260,
          deliveryFee: 40,
          location: 'Uptown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDE2OUUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+rkiBNZWRpdGVycmFuZWFuPC90ZXh0Pjwvc3ZnPg==']
        },
        {
          _id: 'uptown6',
          name: 'BBQ Smokehouse',
          description: 'Slow-smoked BBQ and southern comfort food',
          cuisine: ['American', 'BBQ'],
          rating: 4.3,
          totalReviews: 198,
          deliveryTime: '25-35 min',
          minimumOrder: 220,
          deliveryFee: 35,
          location: 'Uptown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjQ0Q4NTNGIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NliBCQlE8L3RleHQ+PC9zdmc+']
        },
        // Additional Midtown Restaurants
        {
          _id: 'midtown4',
          name: 'Pho Saigon',
          description: 'Authentic Vietnamese pho and fresh spring rolls',
          cuisine: ['Vietnamese', 'Asian'],
          rating: 4.1,
          totalReviews: 145,
          deliveryTime: '20-30 min',
          minimumOrder: 180,
          deliveryFee: 30,
          location: 'Midtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkY2MzQ3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NnCBQaG88L3RleHQ+PC9zdmc+']
        },
        {
          _id: 'midtown5',
          name: 'Greek Corner',
          description: 'Traditional Greek dishes and fresh gyros',
          cuisine: ['Greek', 'Mediterranean'],
          rating: 4.0,
          totalReviews: 112,
          deliveryTime: '25-35 min',
          minimumOrder: 200,
          deliveryFee: 35,
          location: 'Midtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDY4MkI0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+lmSBHcmVlazwvdGV4dD48L3N2Zz4=']
        },
        {
          _id: 'midtown6',
          name: 'Sandwich Central',
          description: 'Gourmet sandwiches and fresh salads',
          cuisine: ['American', 'Fast Food'],
          rating: 3.8,
          totalReviews: 267,
          deliveryTime: '15-25 min',
          minimumOrder: 140,
          deliveryFee: 25,
          location: 'Midtown',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjREFBNTIwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+lqiBTYW5kd2ljaDwvdGV4dD48L3N2Zz4=']
        },
        // Additional Suburb Restaurants
        {
          _id: 'suburb4',
          name: 'Korean BBQ House',
          description: 'Authentic Korean BBQ and kimchi specialties',
          cuisine: ['Korean', 'Asian'],
          rating: 4.4,
          totalReviews: 76,
          deliveryTime: '30-40 min',
          minimumOrder: 300,
          deliveryFee: 45,
          location: 'Suburbs',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjREMxNDNDIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+loCBLb3JlYW48L3RleHQ+PC9zdmc+']
        },
        {
          _id: 'suburb5',
          name: 'Healthy Bowls',
          description: 'Nutritious bowls, smoothies and organic options',
          cuisine: ['Healthy', 'American'],
          rating: 4.2,
          totalReviews: 134,
          deliveryTime: '25-35 min',
          minimumOrder: 180,
          deliveryFee: 40,
          location: 'Suburbs',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTBFRTkwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+llzwvdGV4dD48L3N2Zz4=']
        },
        {
          _id: 'suburb6',
          name: 'Diner Classic',
          description: 'All-day breakfast and classic American comfort food',
          cuisine: ['American', 'Breakfast'],
          rating: 3.9,
          totalReviews: 189,
          deliveryTime: '20-30 min',
          minimumOrder: 160,
          deliveryFee: 35,
          location: 'Suburbs',
          images: ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZCNkMxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+lniBEaW5lcjwvdGV4dD48L3N2Zz4=']
        }
      ];
      
      // Apply filters to sample data
      let filteredSample = sampleRestaurants;
      if (filters.search) {
        filteredSample = filteredSample.filter(restaurant => 
          restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          restaurant.cuisine?.some(c => c.toLowerCase().includes(filters.search.toLowerCase()))
        );
      }
      if (filters.cuisine) {
        filteredSample = filteredSample.filter(restaurant => 
          restaurant.cuisine?.includes(filters.cuisine)
        );
      }
      if (filters.minRating) {
        filteredSample = filteredSample.filter(restaurant => 
          restaurant.rating >= parseFloat(filters.minRating)
        );
      }
      
      setRestaurants(filteredSample);
      toast.info('Showing sample restaurants (API unavailable)');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      cuisine: '',
      minRating: ''
    });
  };

  const hasActiveFilters = filters.search || filters.cuisine || filters.minRating;

  return (
    <Container className="my-5">
      <h2 className="mb-4">All Restaurants</h2>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">🔍 Filter Restaurants</h5>
            {hasActiveFilters && (
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={clearFilters}
              >
                ✖ Clear Filters
              </Button>
            )}
          </div>
          
          <Row className="g-3">
            <Col md={4}>
              <Form.Label className="small text-muted mb-1">🍽️ Search</Form.Label>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="search"
                  placeholder="Restaurant name or cuisine..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Label className="small text-muted mb-1">🍲 Cuisine Type</Form.Label>
              <Form.Select
                name="cuisine"
                value={filters.cuisine}
                onChange={handleFilterChange}
              >
                <option value="">All Cuisines</option>
                <option value="Indian">🍛 Indian</option>
                <option value="Chinese">🥡 Chinese</option>
                <option value="Italian">🍕 Italian</option>
                <option value="Mexican">🌮 Mexican</option>
                <option value="Fast Food">🍔 Fast Food</option>
                <option value="American">🌭 American</option>
                <option value="Asian">🍜 Asian</option>
                <option value="Thai">🌶️ Thai</option>
                <option value="Japanese">🍣 Japanese</option>
                <option value="Korean">🥢 Korean</option>
                <option value="Vietnamese">🍜 Vietnamese</option>
                <option value="Mediterranean">🫒 Mediterranean</option>
                <option value="Greek">🥙 Greek</option>
                <option value="BBQ">🍖 BBQ</option>
                <option value="Healthy">🥗 Healthy</option>
                <option value="Cafe">☕ Cafe</option>
                <option value="Breakfast">🥞 Breakfast</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label className="small text-muted mb-1">⭐ Minimum Rating</Form.Label>
              <Form.Select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
              >
                <option value="">All Ratings</option>
                <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
                <option value="3">⭐⭐⭐ 3+ Stars</option>
                <option value="2">⭐⭐ 2+ Stars</option>
              </Form.Select>
            </Col>
          </Row>
          
          {hasActiveFilters && (
            <div className="mt-3 pt-2 border-top">
              <small className="text-muted">
                Active filters: 
                {filters.search && <span className="badge bg-primary me-1">🔍 {filters.search}</span>}
                {filters.cuisine && <span className="badge bg-success me-1">🍲 {filters.cuisine}</span>}
                {filters.minRating && <span className="badge bg-warning me-1">⭐ {filters.minRating}+ Stars</span>}
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Results Header */}
      {!loading && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            {restaurants.length > 0 ? (
              <>🏪 Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}</>
            ) : (
              <>🔍 No restaurants found</>
            )}
          </h4>
          {restaurants.length > 0 && (
            <small className="text-muted">
              Showing results {hasActiveFilters ? 'with filters' : 'for all restaurants'}
            </small>
          )}
        </div>
      )}

      {/* Restaurant List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading restaurants...</span>
          </div>
          <p className="mt-3 text-muted">Finding the best restaurants for you...</p>
        </div>
      ) : restaurants.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div className="mb-3" style={{ fontSize: '4rem' }}>😔</div>
            <h4>No restaurants found</h4>
            <p className="text-muted mb-3">
              {hasActiveFilters 
                ? 'Try adjusting your filters to see more results' 
                : 'No restaurants available in this area'
              }
            </p>
            {hasActiveFilters && (
              <Button variant="outline-primary" onClick={clearFilters}>
                ✖ Clear All Filters
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {restaurants.map(restaurant => (
            <Col md={4} key={restaurant._id} className="mb-4">
              <Card className="h-100 shadow-sm hover-card">
                <Card.Img 
                  variant="top" 
                  src={restaurant.images?.[0] || 'https://via.placeholder.com/400x200'} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{restaurant.name}</Card.Title>

                  <Card.Text className="text-muted small">
                    {restaurant.description}
                  </Card.Text>
                  <Card.Text className="text-muted">
                    {restaurant.cuisine?.join(', ')}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>
                        ⭐ {restaurant.rating?.toFixed(1) || '4.0'} ({restaurant.totalReviews || 0})
                      </span>
                      <span className="text-muted">{restaurant.deliveryTime}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="small text-muted">
                        Min: ₹{restaurant.minimumOrder || 200}
                      </span>
                      <span className="small text-muted">
                        Delivery: ₹{restaurant.deliveryFee || 40}
                      </span>
                    </div>
                    <Button 
                      as={Link} 
                      to={`/restaurant/${restaurant._id}`} 
                      variant="danger" 
                      className="w-100"
                    >
                      View Menu
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default RestaurantList;