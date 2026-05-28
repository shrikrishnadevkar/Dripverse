import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { User, Design, Comment, Subscription, SavedDesign } from "./src/types";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "data", "db.json");

// Helper function to ensure database structure
function getInitialDatabase() {
  const seedDesigns: Design[] = [];

  const categoriesList = [
    "T-Shirts",
    "Oversized T-Shirts",
    "Check Shirts",
    "Cargo Pants",
    "Baggy Jeans",
    "Sneakers",
    "Hoodies",
    "Watches",
    "Streetwear",
    "Jackets"
  ];

  const celebs = [
    { name: "Kanye West", handle: "worn-by-kanye", story: "Ye styled this heavily-washed piece during his creative compound design workshops in Tokyo." },
    { name: "Travis Scott", handle: "worn-by-travis", story: "La Flame was spotted donning this utility silhouette at his backstage album listening session." },
    { name: "Billie Eilish", handle: "worn-by-billie", story: "Billie Eilish wore this massive custom-built garment on stage during her world arena tour opening night." },
    { name: "A$AP Rocky", handle: "worn-by-rocky", story: "Lord Flacko styled this incredible high-street contour look at the Milan Fashion Week front-row." },
    { name: "Zendaya", handle: "worn-by-zendaya", story: "Zendaya debuted this gorgeous layout coordinate print during her late-night television talkshow appearance." },
    { name: "Hailey Bieber", handle: "worn-by-hailey", story: "Hailey Bieber was seen styling this slouchy luxury piece for an off-duty modeling walk in Paris." },
    { name: "Justin Bieber", handle: "worn-by-justin", story: "Bieber wore this cozy loose collection garment on stage during his tour's acoustic set." },
    { name: "Pharrell Williams", handle: "worn-by-pharrell", story: "Pharrell debuted this vibrant customized iteration at a luxury brand capsule collection reveal." }
  ];

  const adjectives = ["Heavyweight", "Vintage-Washed", "Distressed Core", "Cyberpunk", "Acid-Washed", "Stealth Black", "Minimal", "Premium Luxe", "Neo-Grunge", "Retro Active", "Industrial", "Futuristic", "Hand-Dyed", "Urban", "Casual Lounge", "Sub-Zero", "Couture Design", "Rebel Core", "Tactical", "Deconstructed"];

  const designNouns: Record<string, string[]> = {
    "T-Shirts": ["Acid Bleach Deathcore Tee", "Classic Essential Arch Tee", "Tokyo Street Viper Tee", "Minimal Boxy Cotton Tee", "Vintage Rose Embroidery Tee", "Liquid Metal Chrome Tee", "Earth Sand-Washed Tee", "Tech Panel Jersey Tee", "Paint Splattered Bespoke Tee", "Gothic Spiked Arch Tee"],
    "Oversized T-Shirts": ["Drop-Shoulder Heavier Tee", "Donda Silhouette Heavy Tee", "Blohsh Baggy Neon Tee", "Rip Vintage Distressed Tee", "Custom Atelier Cut Tee", "Double-Stitched Boxy Tee", "Shadow Washed Carbon Tee", "Acid Bleached Punk Tee", "Cyber Kanji Graphic Tee", "Puff Printed Graphic Tee"],
    "Check Shirts": ["Grunge Tartan Plaid Overshirt", "Heavy Blend Buffalo Check Flannel", "Shadow Bleached Fringe Flannel", "Hooded Flannel Utility Jacket", "Retro Patchwork Corduroy Shirt", "Relaxed Street Fleece Flannel", "Detroit Work Plaid Shirt", "Desert Sand Washed Check", "Classic Indigo Western Check", "Cozy Flannel Layer Overshirt"],
    "Cargo Pants": ["Multi-pocket Parachute Cargos", "Vandal Cyber Techwear Cargos", "Sage Canvas Combat Utility Pants", "Classic Quick-Release Strap Cargos", "Stealth Tactical Multi-pocket Pants", "Loose Canvas Carpenter Jogger", "Heavyweight Cargo Trousers", "Distressed Combat Olive Cargo", "Urban Trekking Modular Pants", "Adjustable Drawstring Ankle Joggers"],
    "Baggy Jeans": ["Vintage Slouchy Skater Jeans", "Extreme Wide-Leg Stone-Wash Jeans", "Graffiti Splattered Loose Denims", "Charcoal Dark Slouch Jeans", "Pre-Ripped Distressed Skater Jeans", "Heavyweight Double-Knee Baggy Denims", "Artisanal Bleached Denim Pants", "Urban Wide-Stack skater Denim", "Worn-In Vintage Washed Jeans", "Bespoke Stitch Slouch Denim"],
    "Sneakers": ["Chunky Retro Street Trainers", "Stealth Tech Lightweight Sneakers", "Deconstructed Low-Top Courts", "Double-Mesh Sculpted Runner", "Gilded Panel Luxury High-tops", "Neo Suede Street Footwear", "Retro Athletic Platform Shoes", "Distressed Paint Spattered Trainers", "Cyber-Knit Lightweight Sneakers", "Handcrafted Vulcanized Low-tops"],
    "Hoodies": ["Heavyweight Drawstring-less Hoodie", "Cyberpunk Neon Kanji Hoodie", "Distressed Acid Faded Hoodie", "Atelier Loopback Boxy Hoodie", "Anarchy Acid-Washed Hoodie", "Comfy Fleece Slouch Hoodie", "Cozy Heavyweight Core Hoodie", "Stealth Zip Pullover Hoodie", "Contrast Rib Paneled Hoodie", "Bespoke Oversized Cozy Hoodie"],
    "Watches": ["Carbon Matte Stealth Watch", "Stealth Cybernetic Dial Chrono", "Tactical Military Field Watch", "Retro Luxury Brushed Gold Watch", "Surgical-Grade Steel Chrono", "Titanium Carbon Caliber Timepiece", "Vulcanized Rubber Sport Watch", "Minimal Moonphase Wristwatch", "Luxe Dial Tourbillon Edition", "Aviation Brushed Tachymeter watch"],
    "Streetwear": ["Cyber Tech Windbreaker Suit", "Terry Fleece Lounge Coordinates", "Asymmetrical Modular utility Vest", "Monogram Knit Oversized Cardigan", "Tokyo Anime Core Sweatshirt", "Knit Panel Athleisure Crewneck", "Puff Print Streetwear Sweater", "Cozy High-Street Knit Cardigan", "Tactical Tech Panel Tracksuit", "Futuristic Reflective Jogger Set"],
    "Jackets": ["Cowhide Asymmetrical Biker Jacket", "Heavy Denim Distressed Trucker Jacket", "Tactical Cargo Flight Bomber Jacket", "Atelier Corduroy Workwear Jacket", "High-Collar Packable Windbreaker", "Reflective Combat Field Jacket", "Asymmetrical Aviator Shearling Coat", "Luxury Quilted Oversized Parka", "Washed Suede Shacket Coat", "Retro Athletic Vintage Coach Jacket"]
  };

  const catImages: Record<string, string[]> = {
    "T-Shirts": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503341503653-03022bc78f5f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574164904299-3a102b110380?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce802585e4?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1622445262465-24819757b50d?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1000&auto=format&fit=crop&q=80"
    ],
    "Oversized T-Shirts": [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503341503653-03022bc78f5f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce802585e4?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574164904299-3a102b110380?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1000&auto=format&fit=crop&q=80"
    ],
    "Check Shirts": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce802585e4?w=1000&auto=format&fit=crop&q=80"
    ],
    "Cargo Pants": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80"
    ],
    "Baggy Jeans": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80"
    ],
    "Sneakers": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=80"
    ],
    "Hoodies": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503341503653-03022bc78f5f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce802585e4?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574164904299-3a102b110380?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop&q=80"
    ],
    "Watches": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434056886845-dac89ffee9b5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1619134778706-7015533a6150?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517502884422-41eaaced0168?w=1000&auto=format&fit=crop&q=80"
    ],
    "Streetwear": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503341503653-03022bc78f5f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce802585e4?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574164904299-3a102b110380?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1000&auto=format&fit=crop&q=80"
    ],
    "Jackets": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1000&auto=format&fit=crop&q=80"
    ]
  };

  const designers = ["DRIPVERSE Atelier", "VINTAGE SOULS", "YAKUZA CHRONICLES", "VERVE Tokyo", "HELLFIRE CLOTH", "Sartorial Rebels", "KAWASAKI ST.", "AETHER Lab"];

  // Programmatically construct 20 beautiful, diverse items per category (Total = 200 items!)
  categoriesList.forEach((cat) => {
    const nounsList = designNouns[cat] || ["Streetwear Silhouette"];
    const imagesList = catImages[cat] || [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80"
    ];

    for (let i = 0; i < 20; i++) {
      const designIndex = i % nounsList.length;
      const adjective = adjectives[(i * 3 + cat.charCodeAt(0)) % adjectives.length];
      const noun = nounsList[designIndex];
      const title = `${adjective} ${noun}`;
      
      const imageUrl = imagesList[i % imagesList.length];
      
      // Seed a celebrity for roughly every other item
      const celebRef = (i % 2 === 0) ? celebs[(i + cat.charCodeAt(0)) % celebs.length] : null;
      
      const tagsSet = new Set(["streetwear", cat.toLowerCase().replace(/\s+/g, ""), "trending"]);
      if (celebRef) {
        tagsSet.add(celebRef.handle);
        tagsSet.add("celebrity-worn");
        tagsSet.add("hq-couture");
      }
      if (i % 3 === 0) tagsSet.add("customisable");
      if (i % 4 === 0) tagsSet.add("vintage");
      if (i % 5 === 0) tagsSet.add("premium");
      const tags = Array.from(tagsSet);

      const celebrityStory = celebRef 
          ? ` Verified Celebrity Fashion Loop: ${celebRef.story}` 
          : " A verified piece of DRIPVERSE core wardrobe line. Highly premium finish and perfect street silhouette.";

      const description = `The premium high-resolution ${title}. Meticulously finished using state-of-the-art stitching with heavy ribbing guidelines, giving standard luxury structure and complete everyday comfort.${celebrityStory}`;

      seedDesigns.push({
        id: `design-${cat.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
        title,
        category: cat,
        image_url: imageUrl,
        tags,
        description,
        is_premium: (i % 4 === 0) || (celebRef !== null && i % 3 === 0),
        is_trending: (i % 3 === 0) || (celebRef !== null),
        is_weekly_top: i % 7 === 0,
        is_monthly_top: i % 8 === 0,
        likes: i % 2 === 0 ? ["user-1"] : [],
        views: 100 + Math.floor(Math.random() * 2400),
        uploaded_by: "admin",
        designer_name: designers[(i + cat.charCodeAt(0)) % designers.length],
        created_at: new Date(Date.now() - i * 12 * 3600 * 1000).toISOString()
      });
    }
  });

  const seedComments: Comment[] = [
    {
      id: "comment-1",
      user_id: "user-1",
      user_name: "Shri Krishna",
      user_email: "shrikrishnadevkar60@gmail.com",
      design_id: "design-t-shirts-1",
      comment: "This graphic tee is absolutely fire in person! The texture detail is unbelievable.",
      created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "comment-2",
      user_id: "user-2",
      user_name: "Rohan Juneja",
      user_email: "rohan@dripverse.com",
      design_id: "design-t-shirts-1",
      comment: "Best oversized fit in this collection. Definitely purchasing the VIP lookbook next week.",
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: "comment-3",
      user_id: "user-1",
      user_name: "Shri Krishna",
      user_email: "shrikrishnadevkar60@gmail.com",
      design_id: "design-sneakers-1",
      comment: "The neon details on the chunky trainers are crazy! Completely worth the premium subscription.",
      created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    }
  ];

  const seedUsers: User[] = [
    {
      id: "user-1",
      name: "Shri Krishna (Admin)",
      email: "shrikrishnadevkar60@gmail.com",
      profile_image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
      premium_plan: "yearly",
      premium_expiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      role: "admin"
    },
    {
      id: "user-admin",
      name: "Dripverse Administrator",
      email: "admin@dripverse.com",
      profile_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      premium_plan: "yearly",
      premium_expiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      created_at: new Date(Date.now() - 100 * 24 * 3600 * 1000).toISOString(),
      role: "admin"
    }
  ];

  const seedSaved: SavedDesign[] = [
    {
      id: "saved-1",
      user_id: "user-1",
      design_id: "design-t-shirts-1",
      created_at: new Date().toISOString()
    },
    {
      id: "saved-2",
      user_id: "user-1",
      design_id: "design-sneakers-1",
      created_at: new Date().toISOString()
    }
  ];

  const seedSubscriptions: Subscription[] = [
    {
      id: "sub-1",
      user_id: "user-1",
      plan_type: "monthly",
      payment_id: "pay_XYZ123890abc",
      amount: 199,
      created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      expiry_date: new Date(Date.now() + 25 * 24 * 3600 * 1000).toISOString()
    }
  ];

  return {
    users: seedUsers,
    designs: seedDesigns,
    comments: seedComments,
    subscriptions: seedSubscriptions,
    saved_designs: seedSaved
  };
}

// Ensure database file directory and data exist
function initDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // We ALWAYS force overwrite to ensure that the user gets the fresh 20-20 images per category and celebrities loaded now!
  fs.writeFileSync(DB_FILE, JSON.stringify(getInitialDatabase(), null, 2));
}

initDb();

// Load & Save db utilities
function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading db.json, resetting...", err);
    return getInitialDatabase();
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error("Error writing db.json", err);
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "20mb" })); // Raise limit for base64 uploads

  // Standard API status
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "DRIPVERSE Premium Fashion Server" });
  });

  // Get current session or simulate logged in state
  // We can track logged in users by simple authorization header or query parameters
  // For sandbox, we'll maintain active user as a simple query-param simulated session
  app.get("/api/auth/me", (req, res) => {
    const db = readDb();
    const emailHeader = req.headers["authorization"] || "";
    const email = emailHeader.replace("Bearer ", "").trim();

    if (!email) {
      // Return default guest
      return res.json({ user: null });
    }

    const found = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      return res.json({ user: found });
    }

    res.json({ user: null });
  });

  // User Signup
  app.post("/api/auth/signup", (req, res) => {
    const { name, email, phone, password, isGoogle } = req.body;
    
    const db = readDb();
    
    let targetEmail = email ? email.toLowerCase().trim() : "";
    if (!targetEmail && phone) {
      targetEmail = phone + "@dripverify.com";
    }

    if (!name && !phone && !email) {
      return res.status(400).json({ error: "Required fields missing for signup." });
    }

    // Special validation for admin
    if (targetEmail === "shrikrishnadevkar60@gmail.com" && password !== "303030") {
      return res.status(401).json({ error: "Invalid admin password prefix" });
    }

    const existing = db.users.find((u: User) => 
      (targetEmail && u.email.toLowerCase() === targetEmail.toLowerCase()) || 
      (phone && u.phone === phone)
    );
    if (existing) {
      return res.status(400).json({ error: "User profile already registered." });
    }

    const isNewAdmin = targetEmail === "shrikrishnadevkar60@gmail.com" || targetEmail === "admin@dripverse.com";
    const newUser: User = {
      id: "user-" + Math.random().toString(36).substring(2, 11),
      name: name || (phone ? "Phone User" : "Couture Explorer"),
      email: targetEmail,
      phone: phone || undefined,
      profile_image: `https://images.unsplash.com/photo-${isNewAdmin ? "1519085360753-af0119f7cbe7" : "1535713875002-d1d0cf377fde"}?w=100&auto=format&fit=crop&q=80`,
      premium_plan: isNewAdmin ? "yearly" : "none",
      premium_expiry: isNewAdmin ? new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString() : undefined,
      created_at: new Date().toISOString(),
      role: isNewAdmin ? "admin" : "user"
    };

    db.users.push(newUser);
    writeDb(db);

    res.status(201).json({ user: newUser, token: targetEmail });
  });

  // User Login
  app.post("/api/auth/login", (req, res) => {
    const { email, phone, isGoogle, password } = req.body;

    const db = readDb();
    let found: User | undefined;

    if (email) {
      found = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase().trim());
    } else if (phone) {
      found = db.users.find((u: User) => u.phone === phone);
    }

    // Strict Password validation for the admin email
    if (email && email.toLowerCase().trim() === "shrikrishnadevkar60@gmail.com") {
      if (password !== "303030") {
        return res.status(401).json({ error: "Invalid password credentials. Admin authentication error (Code 303030)." });
      }
    }

    if (!found) {
      // Auto-register logins on the fly for exceptional user experience
      const isNewAdmin = email && (email.toLowerCase().trim() === "shrikrishnadevkar60@gmail.com" || email.toLowerCase().trim() === "admin@dripverse.com");
      
      const targetEmail = email ? email.toLowerCase().trim() : (phone ? phone + "@dripverify.com" : "explorer-" + Math.random().toString(36).substring(2, 7) + "@google.com");
      
      found = {
        id: "user-" + Math.random().toString(36).substring(2, 11),
        name: isNewAdmin ? "Shri Krishna (Admin)" : (phone ? `Phone User (${phone.slice(-4)})` : "Google Explorer"),
        email: targetEmail,
        phone: phone || undefined,
        profile_image: `https://images.unsplash.com/photo-${isNewAdmin ? "1519085360753-af0119f7cbe7" : "1535713875002-d1d0cf377fde"}?w=100&auto=format&fit=crop&q=80`,
        premium_plan: isNewAdmin ? "yearly" : "none",
        premium_expiry: isNewAdmin ? new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString() : undefined,
        created_at: new Date().toISOString(),
        role: isNewAdmin ? "admin" : "user"
      };

      db.users.push(found);
      writeDb(db);
    }

    res.json({ user: found, token: found.email });
  });

  // Get Designs
  app.get("/api/designs", (req, res) => {
    const db = readDb();
    // Support filtering, categories and sorting
    let list = [...db.designs];

    // Search query matched with title, description, category, tags
    const { search, category, filter, tag } = req.query;

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        d =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    if (category && category !== "All") {
      list = list.filter(d => d.category.toLowerCase() === String(category).toLowerCase());
    }

    if (tag) {
      list = list.filter(d => d.tags.includes(String(tag)));
    }

    // Filters: 'Latest' | 'Most Viewed' | 'Trending' | 'Most Liked'
    if (filter === "Latest" || !filter) {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (filter === "Most Viewed") {
      list.sort((a, b) => b.views - a.views);
    } else if (filter === "Most Liked") {
      list.sort((a, b) => b.likes.length - a.likes.length);
    } else if (filter === "Trending") {
      list = list.filter(d => d.is_trending);
      list.sort((a, b) => b.views - a.views);
    }

    res.json(list);
  });

  // Get specific design + Increment Views count
  app.get("/api/designs/:id", (req, res) => {
    const db = readDb();
    const design = db.designs.find((d: Design) => d.id === req.params.id);
    if (!design) {
      return res.status(404).json({ error: "Fashion trends not found" });
    }

    // Increment views
    design.views += 1;
    writeDb(db);

    res.json(design);
  });

  // Toggle Like on Design
  app.post("/api/designs/:id/like", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ error: "Log in needed to perform this action" });
    }

    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Log in needed to perform this action" });
    }

    const design = db.designs.find((d: Design) => d.id === req.params.id);
    if (!design) {
      return res.status(404).json({ error: "Design not found" });
    }

    const likedIndex = design.likes.indexOf(user.id);
    if (likedIndex > -1) {
      design.likes.splice(likedIndex, 1); // Unlike
    } else {
      design.likes.push(user.id); // Like
    }

    writeDb(db);
    res.json({ likes: design.likes, isLiked: design.likes.includes(user.id) });
  });

  // Toggle Bookmark / Save design
  app.post("/api/designs/:id/save", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ error: "Log in needed to perform this action" });
    }

    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Log in needed to perform this action" });
    }

    const index = db.saved_designs.findIndex((s: SavedDesign) => s.user_id === user.id && s.design_id === req.params.id);
    let isSaved = false;

    if (index > -1) {
      db.saved_designs.splice(index, 1);
      isSaved = false;
    } else {
      db.saved_designs.push({
        id: "saved-" + Math.random().toString(36).substring(2, 11),
        user_id: user.id,
        design_id: req.params.id,
        created_at: new Date().toISOString()
      });
      isSaved = true;
    }

    writeDb(db);
    res.json({ isSaved });
  });

  // Get saved state
  app.get("/api/designs/:id/saved-state", (req, res) => {
    const emailHeader = req.headers["authorization"] || "";
    const email = emailHeader.replace("Bearer ", "").trim();
    if (!email) {
      return res.json({ isSaved: false, isLiked: false });
    }

    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.json({ isSaved: false, isLiked: false });
    }

    const isSaved = db.saved_designs.some((s: SavedDesign) => s.user_id === user.id && s.design_id === req.params.id);
    const design = db.designs.find((d: Design) => d.id === req.params.id);
    const isLiked = design ? design.likes.includes(user.id) : false;

    res.json({ isSaved, isLiked });
  });

  // Get Bookmarked list
  app.get("/api/saved-collections", (req, res) => {
    const emailHeader = req.headers["authorization"] || "";
    const email = emailHeader.replace("Bearer ", "").trim();
    if (!email) {
      return res.json([]);
    }

    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.json([]);

    const savedIds = db.saved_designs.filter((s: SavedDesign) => s.user_id === user.id).map((s: SavedDesign) => s.design_id);
    const savedDesignsList = db.designs.filter((d: Design) => savedIds.includes(d.id));

    res.json(savedDesignsList);
  });

  // Get Comments
  app.get("/api/designs/:id/comments", (req, res) => {
    const db = readDb();
    const commentsList = db.comments
      .filter((c: Comment) => c.design_id === req.params.id)
      .sort((a: Comment, b: Comment) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(commentsList);
  });

  // Post Comments
  app.post("/api/designs/:id/comments", (req, res) => {
    const { email, commentText } = req.body;
    if (!email || !commentText) {
      return res.status(400).json({ error: "Must provide non-empty comment text and authorized login" });
    }

    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "User is not logged in" });
    }

    const newComment: Comment = {
      id: "comment-" + Math.random().toString(36).substring(2, 11),
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
      user_image: user.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      design_id: req.params.id,
      comment: commentText,
      created_at: new Date().toISOString()
    };

    db.comments.push(newComment);
    writeDb(db);

    res.status(201).json(newComment);
  });

  // Premium Subscription with simulated Razorpay payment gateway
  app.post("/api/subscribe", (req, res) => {
    const { email, plan_type, payment_id, amount } = req.body;
    if (!email || !plan_type || !payment_id) {
      return res.status(400).json({ error: "Missing required subscription parameter specs" });
    }

    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "No user found with logged-in credentials" });
    }

    // Expiry multiplier days
    let days = 7;
    if (plan_type === "monthly") days = 30;
    else if (plan_type === "yearly") days = 365;

    const expiryDate = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString();

    // Log subscription transaction
    const newSub: Subscription = {
      id: "sub-" + Math.random().toString(36).substring(2, 11),
      user_id: user.id,
      plan_type,
      payment_id,
      amount: Number(amount),
      created_at: new Date().toISOString(),
      expiry_date: expiryDate
    };

    db.subscriptions.push(newSub);

    // Update User premium structure state
    user.premium_plan = plan_type;
    user.premium_expiry = expiryDate;

    writeDb(db);
    res.json({ success: true, user, subscription: newSub });
  });

  // Admin CRUD Endpoint: Create a new Trend Design
  app.post("/api/designs", (req, res) => {
    const { email, title, category, image_url, tags, description, is_premium, is_trending, is_weekly_top, is_monthly_top, designer_name } = req.body;

    // Check credentials
    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email?.toLowerCase());
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorised access to administrator features" });
    }

    if (!title || !category || !image_url) {
      return res.status(400).json({ error: "Please enter title, category selection, and design photo URL." });
    }

    const newDesign: Design = {
      id: "design-" + Math.random().toString(36).substring(2, 11),
      title,
      category,
      image_url,
      tags: Array.from(new Set(Array.isArray(tags) ? tags : String(tags).split(",").map(s => s.trim()).filter(Boolean))),
      description: description || `Premium luxury trend representation of ${category}`,
      is_premium: !!is_premium,
      is_trending: !!is_trending,
      is_weekly_top: !!is_weekly_top,
      is_monthly_top: !!is_monthly_top,
      likes: [],
      views: 1,
      uploaded_by: user.id,
      designer_name: designer_name || "Admin Studio",
      created_at: new Date().toISOString()
    };

    db.designs.unshift(newDesign);
    writeDb(db);

    res.status(201).json(newDesign);
  });

  // Admin CRUD Endpoint: UPDATE Fashion Design
  app.put("/api/designs/:id", (req, res) => {
    const { email, title, category, image_url, tags, description, is_premium, is_trending, is_weekly_top, is_monthly_top, designer_name } = req.body;

    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email?.toLowerCase());
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorised access" });
    }

    const designIndex = db.designs.findIndex((d: Design) => d.id === req.params.id);
    if (designIndex === -1) {
      return res.status(404).json({ error: "Design not found" });
    }

    const updated = {
      ...db.designs[designIndex],
      title: title || db.designs[designIndex].title,
      category: category || db.designs[designIndex].category,
      image_url: image_url || db.designs[designIndex].image_url,
      tags: Array.from(new Set(Array.isArray(tags) ? tags : String(tags).split(",").map(t => t.trim()).filter(Boolean))),
      description: description || db.designs[designIndex].description,
      is_premium: is_premium !== undefined ? !!is_premium : db.designs[designIndex].is_premium,
      is_trending: is_trending !== undefined ? !!is_trending : db.designs[designIndex].is_trending,
      is_weekly_top: is_weekly_top !== undefined ? !!is_weekly_top : db.designs[designIndex].is_weekly_top,
      is_monthly_top: is_monthly_top !== undefined ? !!is_monthly_top : db.designs[designIndex].is_monthly_top,
      designer_name: designer_name || db.designs[designIndex].designer_name
    };

    db.designs[designIndex] = updated;
    writeDb(db);

    res.json(updated);
  });

  // Admin CRUD Endpoint: DELETE Fashion Design
  app.delete("/api/designs/:id", (req, res) => {
    const emailHeader = req.headers["authorization"] || "";
    const email = emailHeader.replace("Bearer ", "").trim();

    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorised access" });
    }

    const designIndex = db.designs.findIndex((d: Design) => d.id === req.params.id);
    if (designIndex === -1) {
      return res.status(404).json({ error: "Design not found to delete" });
    }

    db.designs.splice(designIndex, 1);
    writeDb(db);

    res.json({ success: true, message: "Fashion apparel design deleted successfully" });
  });

  // Admin Panel Dashboard Metrics
  app.get("/api/admin/metrics", (req, res) => {
    const emailHeader = req.headers["authorization"] || "";
    const email = emailHeader.replace("Bearer ", "").trim();

    const db = readDb();
    const user = db.users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const totalUsers = db.users.length;
    const premiumUsers = db.users.filter((u: User) => u.premium_plan !== "none" || u.role === "admin").length;
    const totalDesigns = db.designs.length;
    const totalLikes = db.designs.reduce((sum: number, d: Design) => sum + d.likes.length, 0);
    const totalViews = db.designs.reduce((sum: number, d: Design) => sum + d.views, 0);

    const subscriptionEarnings = db.subscriptions.reduce((sum: number, s: Subscription) => sum + s.amount, 0);

    // Categories Breakdown
    const categoryCount: Record<string, number> = {};
    db.designs.forEach((d: Design) => {
      categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
    });

    res.json({
      totalUsers,
      premiumUsers,
      totalDesigns,
      totalLikes,
      totalViews,
      subscriptionEarnings,
      categoryCount
    });
  });

  // Vite Integration handles server and routing for both SPA and production assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DRIPVERSE] Luxury Server boot initialized at port ${PORT}`);
  });
}

startServer();
