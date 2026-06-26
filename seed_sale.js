import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9Yv31716b_ONzneukkVhFf50INXIwu0o",
  authDomain: "nimasa-tex-e19b9.firebaseapp.com",
  projectId: "nimasa-tex-e19b9",
  storageBucket: "nimasa-tex-e19b9.firebasestorage.app",
  messagingSenderId: "296116256862",
  appId: "1:296116256862:web:1a459fe7528e6bf91334cf",
  measurementId: "G-4BYE7FZDPJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const saleItems = [
  {
    title: "Premium Silk Saree",
    category: "Women",
    price: "12,000.00",
    originalPrice: "15,000.00",
    isSale: true,
    image: "/images/women_fashion_editorial_1782340418253.png",
    hoverImage: "/images/women_casual_tshirt.png",
    description: "Elegant silk saree with intricate embroidery, perfect for special occasions.",
    stock: "15",
    sizes: ["Free Size"],
    gallery: []
  },
  {
    title: "Men's Formal Classic Shirt",
    category: "Men",
    price: "3,500.00",
    originalPrice: "4,500.00",
    isSale: true,
    image: "/images/men_fashion_editorial_1782340405171.png",
    hoverImage: "/images/men_nocoat_1782340559911.png",
    description: "A comfortable and stylish formal shirt for office wear.",
    stock: "25",
    sizes: ["S", "M", "L", "XL"],
    gallery: []
  },
  {
    title: "Kids Denim Jeans",
    category: "Kids",
    price: "2,800.00",
    originalPrice: "3,500.00",
    isSale: true,
    image: "/images/kids_jeans.png",
    hoverImage: "/images/kids_tshirt.png",
    description: "Durable and trendy denim jeans for kids.",
    stock: "20",
    sizes: ["4Y", "5Y", "6Y", "7Y"],
    gallery: []
  },
  {
    title: "Women's Evening Gown",
    category: "Women",
    price: "8,500.00",
    originalPrice: "11,000.00",
    isSale: true,
    image: "/images/women_evening_gown.png",
    hoverImage: "/images/women_summer_dress.png",
    description: "Beautiful evening gown with sequin details.",
    stock: "10",
    sizes: ["S", "M", "L"],
    gallery: []
  },
  {
    title: "Kids Winter Jacket",
    category: "Kids",
    price: "4,200.00",
    originalPrice: "5,500.00",
    isSale: true,
    image: "/images/kids_jacket.png",
    hoverImage: "/images/kids_tshirt.png",
    description: "Warm and cozy winter jacket for the cold days.",
    stock: "12",
    sizes: ["6Y", "8Y", "10Y"],
    gallery: []
  }
];

async function seed() {
  for (let item of saleItems) {
    const id = Date.now().toString() + Math.floor(Math.random() * 1000);
    await setDoc(doc(db, 'products', id), { ...item, id });
    console.log(`Added ${item.title}`);
  }
  console.log("Done");
  process.exit(0);
}

seed();
