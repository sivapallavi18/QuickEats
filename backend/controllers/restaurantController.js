const Restaurant = require('../models/Restaurant');

exports.getRestaurants = async (req, res) => {
  try {
    const { cuisine, search, minRating, lat, lng, radius = 10 } = req.query;
    let query = {};

    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Location-based filtering
    if (lat && lng) {
      const radiusInKm = parseFloat(radius);
      query['address.coordinates.lat'] = {
        $gte: parseFloat(lat) - (radiusInKm / 111),
        $lte: parseFloat(lat) + (radiusInKm / 111)
      };
      query['address.coordinates.lng'] = {
        $gte: parseFloat(lng) - (radiusInKm / (111 * Math.cos(parseFloat(lat) * Math.PI / 180))),
        $lte: parseFloat(lng) + (radiusInKm / (111 * Math.cos(parseFloat(lat) * Math.PI / 180)))
      };
    }

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'name email')
      .sort('-rating');

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRestaurant = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.body;

    const restaurants = await Restaurant.find({
      'address.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius
        }
      }
    });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    await restaurant.remove();

    res.status(200).json({
      success: true,
      message: 'Restaurant deleted'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};