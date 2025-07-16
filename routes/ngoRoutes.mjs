import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Donation from "../models/Donation.mjs";

const router = express.Router();

// ✅ Middleware to pass currentPath to views
router.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

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

router.get("/story/:id", (req, res) => {
  const { id } = req.params;

  const stories = [
    {
      id: 1,
      title: "Support and Relief During the COVID-19 Pandemic",
      images: [
        "/images/food.png",
        "/images/food2.jpg",
        "/images/volunteers.jpg",
      ],
      content: `
        Shivshanti Pratishthan played a crucial role during the COVID-19 lockdown by distributing food, masks, and daily supplies across Thane.

        Our volunteers went door-to-door delivering over 1,000 food packets. We collaborated with hospitals and local authorities to reach vulnerable citizens.

        The initiative also supported over 200 frontline workers with sanitizers and face shields.

        We believe community resilience comes from collective care, and this campaign proved that in every sense.
      `,
    },
    {
      id: 2,
      title: "Personal Vehicle Transformed into an Ambulance",
      images: ["/images/covid1.jpg", "/images/ambulance1.jpg"],
      content: `
        In the absence of adequate emergency vehicles, Shivshanti Pratishthan modified private vehicles to serve as ambulances.

        The makeshift ambulances helped transport over 55 patients to hospitals. Local drivers volunteered their time and fuel.

        We ensured oxygen support and medical staff availability where possible. This initiative was covered by TV9 Marathi and praised in civic circles.
      `,
    },
    {
      id: 3,
      title: "Sanitizer Spraying Initiative",
      images: ["/images/sanitizer.png", "/images/spray-action.jpg"],
      content: `
        As part of our COVID safety strategy, we conducted sanitization drives across over 30 housing societies and market areas.

        With proper PPE and spray equipment, our workers ensured surfaces and common areas were disinfected.

        We partnered with BJP members and local sanitation officers. More than 5,000 liters of sanitizer was used during this drive.
      `,
    },
    {
      id: 4,
      title: "Our Goal: Water for Everyone",
      images: ["/images/planting11.jpg", "/images/waterdrive.jpg"],
      content: `
    Access to clean and safe drinking water is a basic human right — yet, in many rural and underserved areas of Maharashtra, communities still face water scarcity and contamination issues.

    Shivshanti Pratishthan has launched a sustainable water access campaign focused on rural outreach. Our efforts include the installation of low-cost filtration units, deep borewell setups, and community water tanks in remote tribal villages.

    In the last year alone, we have successfully provided over 500 households with clean water sources. Alongside infrastructure, we organize awareness workshops on water conservation, rainwater harvesting, and sanitation hygiene.

    Our mission is to ensure that no child has to walk kilometers for drinking water and that every household gets access to this essential resource, especially during the scorching summer months.

    With continued support from partners, CSR sponsors, and volunteers, our "Water for Everyone" campaign is transforming lives — one village at a time.
  `,
    },
    {
      id: 5,
      title: "Swachhta Abhiyan: Weekly Cleanliness Drives in Thane",
      images: ["/images/clean1.jpg", "/images/clean2.jpg", "/images/clean3.jpg"],
      content: `
    As part of our Swachhta Abhiyan initiative, Shivshanti Pratishthan has been actively conducting weekly cleanliness drives across various neighborhoods in Thane.

    These drives are aimed at promoting hygiene, environmental responsibility, and civic awareness among residents. Volunteers from all age groups join hands to clean public spaces like parks, markets, footpaths, and lakesides.

    Over the last few months, more than 20 drives have been organized, resulting in the collection of tons of plastic waste and garbage. We also educate citizens on waste segregation, composting, and minimizing single-use plastic.

    The campaign has received strong support from local municipal authorities, schools, and resident welfare associations. These efforts not only improve the cleanliness of the surroundings but also foster a sense of community participation.

    Let's continue working together for a cleaner, greener, and healthier Thane!
  `
    },
    {
      id: 6,
      title: "Greener Tomorrow: 1,800+ Trees Planted",
      images: ["/images/gogreennew.png", "/images/planting2.jpg", "/images/planting11.jpg"],
      content: `
    As part of our mission for a greener planet, Shivshanti Pratishthan has successfully planted over 1,800 trees across urban and rural zones in Thane.

    These plantation drives are not just about increasing green cover—they represent a commitment to combating climate change, improving air quality, and restoring ecological balance.

    The initiative involved schools, colleges, local citizens, and volunteers, especially youth groups passionate about sustainability. From roadside plantations to community parks and barren land restorations, every sapling planted is a step toward a better future.

    We continue to maintain these green zones through regular watering, nurturing, and awareness campaigns.

    Let's grow a greener tomorrow—one tree at a time.
  `
    },{
  id: 7,
  title: "Lake Revival Mission: Restoring Thane’s Water Bodies",
  images: ["/images/lake1.jpg", "/images/lake2.jpg", "/images/lake3.jpg"],
  content: `
    Shivshanti Pratishthan initiated a comprehensive lake cleaning and restoration campaign to rejuvenate neglected water bodies in Thane.

    The mission focused on removing years of accumulated waste, plastic, and invasive weeds, bringing back the natural beauty and biodiversity of the lakes. With the help of dedicated volunteers, over 5 major lakes were cleaned, resulting in improved water quality and healthier aquatic ecosystems.

    In collaboration with local authorities and environmental experts, we also installed signboards for awareness, promoted eco-friendly rituals, and organized nature walks around the restored lakes.

    These efforts aim to re-establish lakes as community assets—spaces for reflection, relaxation, and environmental education.

    Together, let’s protect our lakes and preserve them for future generations.
  `
},
{
  id: 8,
  title: "Yoga for All: Promoting Holistic Wellbeing in Communities",
  images: ["/images/yoga1.jpg", "/images/yoga2.jpg", "/images/yoga3.jpg"],
  content: `
    Shivshanti Pratishthan introduced the "Yoga for All" campaign to foster physical, mental, and spiritual wellness across diverse age groups in Thane.

    Held weekly in community parks, housing societies, and schools, these sessions are led by certified yoga instructors and focus on improving flexibility, reducing stress, and building mindfulness. The program has witnessed enthusiastic participation from children, senior citizens, and working professionals alike.

    With over 500+ attendees across sessions, the initiative emphasizes the benefits of daily movement, breathing exercises, and meditation. Special workshops are also held on International Yoga Day, featuring collaborative events with healthcare professionals and wellness influencers.

    Beyond the mats, this campaign aims to instill discipline, harmony, and balance in everyday life—aligning perfectly with our broader mission of sustainable and healthy living.

    Join us in embracing the power of yoga for a more peaceful body, mind, and society.
  `
}


  ];

  const story = stories.find((s) => s.id === parseInt(id));
  if (!story) {
    return res.status(404).send("Story not found");
  }

  res.render("story", { story });
});

export default router;
