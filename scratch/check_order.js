const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://gautamtrading:gautamtrading@cluster0.jwprrpo.mongodb.net/gautamtrading?retryWrites=true&w=majority';

async function checkOrder() {
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB Connected');

  const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({}, { strict: false }));

  const order = await Order.findOne({ orderId: 'MXF-493373' });
  console.log('Order MXF-493373 in MongoDB:', JSON.stringify(order, null, 2));

  mongoose.connection.close();
}

checkOrder();
