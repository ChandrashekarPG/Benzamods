const express = require("express");
const router = express.Router();

const services = [
  
  {
    _id: "1",
    name: "Car Vinyl Wrapping",
    image: "/images/services/car-wrap.jpg",
    description: "Premium vinyl wraps in matte, gloss, and chrome finishes to transform your car’s look."
  }
];

router.get("/", (req, res) => {
  res.json(services);
});

module.exports = router;
