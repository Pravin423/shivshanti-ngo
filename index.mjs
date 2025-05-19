import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config.mjs";
import ngoRoutes from "./routes/ngoRoutes.mjs";
import donationRoutes from './routes/donationRoutes.mjs';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();
const app = express();
const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_fiIwmRET6CApc2',  // Replace with your Razorpay Key ID
  key_secret: 'YAEUthsup8SijNs3iveeVlL1' // Replace with your Razorpay Secret Key
});

// Connect to Database
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", ngoRoutes);
app.use('/', donationRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
