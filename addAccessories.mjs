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
    id: "101",
    title: "Premium Leather Belt",
    category: "Accessories",
    price: "LKR 5,500.00",
    image: "/images/accessory_belt.png",
    description: "High quality genuine leather belt with a classic buckle design."
  },
  {
    id: "102",
    title: "Classic Aviator Sunglasses",
    category: "Accessories",
    price: "LKR 8,200.00",
    image: "/images/accessory_sunglasses.png",
    description: "UV400 protection classic aviator sunglasses with metal frame."
  },
  {
    id: "103",
    title: "Minimalist Leather Wallet",
    category: "Accessories",
    price: "LKR 4,800.00",
    image: "/images/accessory_wallet.png",
    description: "Slim minimalist genuine leather wallet with RFID blocking."
  },
  {
    id: "104",
    title: "Signature Noir Perfume",
    category: "Accessories",
    price: "LKR 12,000.00",
    image: "/images/accessory_perfume.png",
    description: "Long-lasting premium eau de parfum with woody and spicy notes."
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
