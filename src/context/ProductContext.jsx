import React, { createContext, useState, useContext, useEffect } from 'react';

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
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nimasa_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved products", e);
      }
    }
    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('nimasa_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    setProducts(prev => {
      // Find max ID
      const maxId = prev.reduce((max, p) => Math.max(max, p.id), 0);
      return [...prev, { ...product, id: maxId + 1 }];
    });
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
