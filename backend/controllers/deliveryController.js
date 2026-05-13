const User = require('../models/User');
const Order = require('../models/Order');

exports.getDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await User.find({ role: 'delivery' })
      .select('name email phone isAvailable');

    res.status(200).json({
      success: true,
      count: deliveryPersons.length,
      data: deliveryPersons
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignDelivery = async (req, res) => {
  try {
    const { orderId, deliveryPersonId } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        deliveryPerson: deliveryPersonId,
        orderStatus: 'assigned'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyDeliveries = async (req, res) => {
  try {
    const deliveries = await Order.find({ deliveryPerson: req.user.id })
      .populate('restaurant', 'name address')
      .populate('customer', 'name phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};