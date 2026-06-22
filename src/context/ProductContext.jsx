import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const initialProducts = [
  {
    id: 1,
    title: "Nike Air Max 270 React",
    category: "Men's Shoes",
    price: "LKR 45,000.00",
    image: "/images/product_1_1779816776674.png",
    hoverImage: "/images/product_1_alt.png"
  },
  {
    id: 2,
    title: "Red Essential Hoodie",
    category: "Men's Apparel",
    price: "LKR 19,500.00",
    image: "/images/product_2_1779816797080.png",
    hoverImage: "/images/product_2_alt.png"
  },
  {
    id: 3,
    title: "Sportswear Windrunner",
    category: "Women's Jacket",
    price: "LKR 33,000.00",
    image: "/images/product_3_1779816815338.png",
    hoverImage: "/images/product_3_alt.png"
  },
  {
    id: 4,
    title: "Pro Training Tights",
    category: "Women's Bottoms",
    price: "LKR 16,500.00",
    image: "/images/product_4_1779816830210.png",
    hoverImage: "/images/product_4_alt.png"
  },
  {
    id: 5,
    title: "Nike Dri-FIT Top",
    category: "Men's Top",
    price: "LKR 12,000.00",
    image: "/images/product_3_1779816815338.png",
    hoverImage: "/images/product_3_alt.png"
  },
  {
    id: 6,
    title: "Nike Tech Fleece",
    category: "Men's Joggers",
    price: "LKR 33,000.00",
    image: "/images/product_4_1779816830210.png",
    hoverImage: "/images/product_4_alt.png"
  }
];

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]); // Start empty, load from Firestore

  useEffect(() => {
    const productsCollection = collection(db, 'products');
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      if (snapshot.empty) {
        setProducts([]);
      } else {
        const firestoreProducts = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        // Sort by ID to maintain consistent order
        firestoreProducts.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setProducts(firestoreProducts);
      }
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product) => {
    try {
      const id = Date.now().toString(); // Use timestamp as unique ID
      await setDoc(doc(db, 'products', id), { ...product, id });
    } catch (e) {
      console.error("Error adding product:", e);
      alert("Failed to add product to database!");
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      await updateDoc(doc(db, 'products', id.toString()), updatedFields);
    } catch (e) {
      console.error("Error updating product:", e);
      alert("Failed to update product!");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id.toString()));
    } catch (e) {
      console.error("Error deleting product:", e);
      alert("Failed to delete product!");
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
