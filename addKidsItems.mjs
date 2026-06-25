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
    id: "201",
    title: "Kids Colorful Graphic T-Shirt",
    category: "Kids",
    price: "LKR 2,500.00",
    image: "/images/kids_tshirt.png",
    description: "Bright and comfortable cotton graphic t-shirt for kids."
  },
  {
    id: "202",
    title: "Kids Denim Jeans",
    category: "Kids",
    price: "LKR 4,200.00",
    image: "/images/kids_jeans.png",
    description: "Durable and stylish denim jeans with adjustable waist."
  },
  {
    id: "203",
    title: "Kids Summer Jacket",
    category: "Kids",
    price: "LKR 3,800.00",
    image: "/images/kids_jacket.png",
    description: "Lightweight summer jacket perfect for breezy evenings."
  },
  {
    id: "204",
    title: "Kids Running Shoes",
    category: "Kids",
    price: "LKR 5,000.00",
    image: "/images/kids_shoes.png",
    description: "Comfortable and supportive running shoes for active kids."
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
