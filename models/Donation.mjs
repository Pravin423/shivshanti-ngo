import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  orderId: String,
  paymentId: String,
  receipt: String,
  date: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;