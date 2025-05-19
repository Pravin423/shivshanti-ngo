import express from 'express';
import Razorpay from 'razorpay';
import { createHmac } from 'crypto'; // Use named import for crypto
import PDFDocument from 'pdfkit';
import Donation from '../models/Donation.mjs'; // Adjust path to your Donation model

const router = express.Router();

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Routes
router.get('/', (req, res) => {
  res.render('donate');
});

router.post('/create-order', async (req, res) => {
  const { name, email, amount } = req.body;

  console.log('Request Body:', req.body); // Debug log

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required (in rupees)' });
  }

  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  console.log('Options sent to Razorpay:', options); // Debug log

  try {
    const order = await razorpay.orders.create(options);

    // Save initial donation data
    const donation = new Donation({
      name,
      email,
      amount,
      orderId: order.id,
      receipt: options.receipt,
    });
    await donation.save();

    res.json({
      id: order.id,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(error.statusCode || 500).send(error.error?.description || 'Error creating order');
  }
});

router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    // Update donation with payment ID
    await Donation.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { paymentId: razorpay_payment_id }
    );
    res.json({ status: 'success', orderId: razorpay_order_id });
  } else {
    res.status(400).json({ status: 'failure' });
  }
});

router.get('/success/:orderId', async (req, res) => {
  const donation = await Donation.findOne({ orderId: req.params.orderId });
  res.render('success', { donation });
});

router.get('/download-receipt/:orderId', async (req, res) => {
  const donation = await Donation.findOne({ orderId: req.params.orderId });

  const doc = new PDFDocument();
  const filename = `receipt_${donation.orderId}.pdf`;

  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);

  // Receipt content
  doc.fontSize(20).text('Donation Receipt', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${donation.name}`);
  doc.text(`Email: ${donation.email}`);
  doc.text(`Amount: ₹${donation.amount}`);
  doc.text(`Payment ID: ${donation.paymentId}`);
  doc.text(`Date: ${donation.date.toLocaleDateString()}`);
  doc.text(`Receipt: ${donation.receipt}`);

  doc.end();
});

router.get('/download-invoice/:orderId', async (req, res) => {
  const donation = await Donation.findOne({ orderId: req.params.orderId });

  const doc = new PDFDocument();
  const filename = `invoice_${donation.orderId}.pdf`;

  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);

  // Invoice content
  doc.fontSize(20).text('Donation Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text('From: Your Organization Name');
  doc.text('To:');
  doc.text(`Name: ${donation.name}`);
  doc.text(`Email: ${donation.email}`);
  doc.moveDown();
  doc.text(`Description: Donation`);
  doc.text(`Amount: ₹${donation.amount}`);
  doc.text(`Date: ${donation.date.toLocaleDateString()}`);
  doc.text(`Order ID: ${donation.orderId}`);

  doc.end();
});

export default router;