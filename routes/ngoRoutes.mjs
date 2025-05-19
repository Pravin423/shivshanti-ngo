import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Donation from "../models/Donation.mjs";

const router = express.Router();

// Ensure the uploads directory exists
const uploadDir = "public/uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Home Page
router.get("/", (req, res) => {
  res.render("home");
});

router.get("/about", (req, res) => {
  res.render("aboutus");
});

router.get("/gallery", (req, res) => {
    let images = [];
    const imagesFilePath = "public/data/images.json"; // Ensure a proper path

    if (fs.existsSync(imagesFilePath)) {
        images = JSON.parse(fs.readFileSync(imagesFilePath, "utf8"));
    }

    res.render("gallery", { images });
});

// Donation Page
router.get("/donate", (req, res) => {
  res.render("donate");
});

// Handle Donation Submission
router.post("/donate", async (req, res) => {
  try {
    const { name, email, amount } = req.body;
    await Donation.create({ name, email, amount });
    res.redirect("/success");
  } catch (error) {
    res.status(500).send("Error processing donation");
  }
});

// Success Page
router.get("/success", (req, res) => {
  res.render("success");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/news", (req, res) => {
  res.render("news");
});

router.get("/wedo", (req, res) => {
  res.render("wedo");
});


export default router;
