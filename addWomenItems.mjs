import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9Yv31716b_ONzneukkVhFf50INXIwu0o",
  projectId: "nimasa-tex-e19b9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newProducts = [
  {
    id: "301",
    title: "Floral Breeze Summer Dress",
    category: "Women",
    price: "LKR 5,500.00",
    image: "/images/women_summer_dress.png",
    description: "A lightweight and breathable summer dress with a beautiful floral print."
  },
  {
    id: "302",
    title: "Executive Tailored Blazer",
    category: "Women",
    price: "LKR 9,800.00",
    image: "/images/women_office_blazer.png",
    description: "A sharp, elegant tailored blazer perfect for the modern professional."
  },
  {
    id: "303",
    title: "Pleated Midi Skirt",
    category: "Women",
    price: "LKR 4,200.00",
    image: "/images/women_floral_skirt.png",
    description: "Flowy and elegant pleated midi skirt, ideal for both casual and formal wear."
  },
  {
    id: "304",
    title: "Premium Cotton Graphic T-Shirt",
    category: "Women",
    price: "LKR 2,800.00",
    image: "/images/women_casual_tshirt.png",
    description: "Ultra-soft premium cotton t-shirt for everyday comfort and style."
  },
  {
    id: "305",
    title: "Midnight Elegance Evening Gown",
    category: "Women",
    price: "LKR 18,500.00",
    image: "/images/women_evening_gown.png",
    description: "A stunning evening gown with intricate detailing for special occasions."
  },
  {
    id: "306",
    title: "Vintage Wash Denim Jacket",
    category: "Women",
    price: "LKR 7,500.00",
    image: "/images/women_denim_jacket.png",
    description: "Classic vintage wash denim jacket that pairs perfectly with any outfit."
  },
  {
    id: "307",
    title: "High-Waist Yoga Leggings",
    category: "Women",
    price: "LKR 3,900.00",
    image: "/images/women_yoga_pants.png",
    description: "Flexible, breathable, and supportive high-waist leggings for your workout."
  },
  {
    id: "308",
    title: "Luxurious Winter Wool Coat",
    category: "Women",
    price: "LKR 22,000.00",
    image: "/images/women_winter_coat.png",
    description: "Stay warm and stylish with this premium long winter wool coat."
  },
  {
    id: "309",
    title: "Satin Silk Wrap Blouse",
    category: "Women",
    price: "LKR 6,200.00",
    image: "/images/women_silk_blouse.png",
    description: "A silky smooth wrap blouse that adds a touch of luxury to your day."
  },
  {
    id: "310",
    title: "Wide-Leg Tailored Trousers",
    category: "Women",
    price: "LKR 5,800.00",
    image: "/images/women_pleated_trousers.png",
    description: "Chic wide-leg tailored trousers, offering unmatched comfort and elegance."
  }
];

async function addProducts() {
  for (const p of newProducts) {
    try {
      await setDoc(doc(db, 'products', p.id), p);
      console.log("Added", p.title);
    } catch (e) {
      console.error("Error adding", p.title, e);
    }
  }
  process.exit(0);
}

addProducts();
