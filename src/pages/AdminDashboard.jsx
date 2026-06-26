import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useHero } from '../context/HeroContext';
import { storage, db } from '../firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// --- SVG Icons ---
const SearchIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);

const AddIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path>
  </svg>
);

const BoxIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
  </svg>
);

const TagsIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
  </svg>
);

const DollarIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
  </svg>
);

const ImageIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const GiftIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>
  </svg>
);

// --- Helper Functions ---
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[^0-9.-]+/g, ""));
};

const formatPrice = (num) => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(num);
};

// --- Main Component ---
const AdminDashboard = () => {
  const { user, logout, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const { ads, settings, addAd, updateAd, deleteAd, updateSettings } = useHero();

  const [activeTab, setActiveTab] = useState('products');
  
  // Product State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '', category: '', price: '', image: '', hoverImage: '', isNewRelease: false, newReleaseExpiry: '',
    description: '', stock: '', sizes: [], gallery: []
  });

  const [dbUsers, setDbUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if ((activeTab === 'users' || activeTab === 'rewards') && dbUsers.length === 0) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const querySnapshot = await getDocs(collection(db, "users"));
          const usersList = [];
          querySnapshot.forEach((doc) => {
            usersList.push({ id: doc.id, ...doc.data() });
          });
          setDbUsers(usersList);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab]);

  // Ad State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const [adForm, setAdForm] = useState({
    button1Text: '', button1Link: '', button2Text: '', button2Link: '', targetPages: ['Home'], adType: 'custom'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [autoplayInterval, setAutoplayInterval] = useState(settings.autoplayInterval || 5);

  // Rewards State
  const [selectedUserForHistory, setSelectedUserForHistory] = useState(null);
  const [userRewardHistory, setUserRewardHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchUserHistory = async (userId) => {
    setLoadingHistory(true);
    setSelectedUserForHistory(userId);
    try {
      const q = query(collection(db, 'users', userId, 'rewardHistory'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const history = [];
      snapshot.forEach(doc => {
        history.push({ id: doc.id, ...doc.data() });
      });
      setUserRewardHistory(history);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Derived Stats
  const totalProducts = products.length;
  const uniqueCategories = new Set(products.map(p => p.category)).size;
  const totalValue = products.reduce((acc, p) => acc + parsePrice(p.price), 0);
  
  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });
  }, [products, searchQuery]);

  if (!user || user.role !== 'admin') return null;

  // Product Methods
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        title: product.title,
        category: product.category,
        price: product.price ? product.price.replace(/[^\d.,]/g, '') : '',
        image: product.image,
        hoverImage: product.hoverImage || '',
        isNewRelease: product.isNewRelease || false,
        newReleaseExpiry: product.newReleaseExpiry || '',
        isSale: product.isSale || false,
        originalPrice: product.originalPrice ? product.originalPrice.replace(/[^\d.,]/g, '') : '',
        description: product.description || '',
        stock: product.stock || '',
        sizes: product.sizes || [],
        gallery: product.gallery || []
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '', category: '', price: '', image: '', hoverImage: '', isNewRelease: false, newReleaseExpiry: '', isSale: false, originalPrice: '',
        description: '', stock: '', sizes: [], gallery: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handlePriceChange = (e) => {
    if (e.target.value === '') {
      setFormData({ ...formData, price: '' });
      return;
    }
    let val = e.target.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts[1];
    if (val) {
      const partsArr = val.split('.');
      partsArr[0] = partsArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      val = partsArr.join('.');
    }
    setFormData({ ...formData, price: val });
  };

  const handleOriginalPriceChange = (e) => {
    if (e.target.value === '') {
      setFormData({ ...formData, originalPrice: '' });
      return;
    }
    let val = e.target.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts[1];
    if (val) {
      const partsArr = val.split('.');
      partsArr[0] = partsArr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      val = partsArr.join('.');
    }
    setFormData({ ...formData, originalPrice: val });
  };

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          // Compress to fit within Firestore 1MB document limit
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setFormData(prev => ({ ...prev, [fieldName]: compressedDataUrl }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), compressedDataUrl] }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const toggleSize = (size) => {
    setFormData(prev => {
      const sizes = prev.sizes || [];
      if (sizes.includes(size)) {
        return { ...prev, sizes: sizes.filter(s => s !== size) };
      } else {
        return { ...prev, sizes: [...sizes, size] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPriceStr = formData.price.replace(/,/g, '');
    const numericPrice = parseFloat(cleanPriceStr);
    const formattedPrice = isNaN(numericPrice) 
      ? formData.price 
      : new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(numericPrice).replace('LKR', 'LKR\u00A0');

    let formattedOriginalPrice = '';
    if (formData.isSale && formData.originalPrice) {
      const cleanOriginalPriceStr = formData.originalPrice.replace(/,/g, '');
      const numericOriginalPrice = parseFloat(cleanOriginalPriceStr);
      formattedOriginalPrice = isNaN(numericOriginalPrice)
        ? formData.originalPrice
        : new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(numericOriginalPrice).replace('LKR', 'LKR\u00A0');
    }

    const productDataToSave = { 
      ...formData, 
      price: formattedPrice,
      originalPrice: formattedOriginalPrice 
    };

    if (editingId) {
      updateProduct(editingId, productDataToSave);
    } else {
      addProduct(productDataToSave);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  // Ad Methods
  const handleOpenAdModal = (ad = null) => {
    if (ad) {
      setEditingAdId(ad.id);
      setAdForm({ ...ad });
    } else {
      setEditingAdId(null);
      setAdForm({ image: '', button1Link: '', targetPages: ['Home'], adType: 'full' });
    }
    setIsAdModalOpen(true);
  };

  const handleCloseAdModal = () => {
    setIsAdModalOpen(false);
    setEditingAdId(null);
  };

  const handleAdChange = (e) => {
    setAdForm({ ...adForm, [e.target.name]: e.target.value });
  };

  const handleTargetPageToggle = (page) => {
    setAdForm(prev => {
      const currentPages = prev.targetPages || (prev.targetPage ? [prev.targetPage] : []);
      let newPages;
      if (currentPages.includes(page)) {
        newPages = currentPages.filter(p => p !== page);
      } else {
        newPages = [...currentPages, page];
      }
      if (newPages.length === 0) newPages = ['Home']; // Ensure at least one is selected
      return { ...prev, targetPages: newPages };
    });
  };

  const handleAdImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 1920 || img.height < 700) {
            alert(`අවවාදයයි! පින්තූරයේ Quality එක අඩුයි. කරුණාකර අවම වශයෙන් 2000x779 pixels හෝ ඊට වැඩි ප්‍රමාණයක පින්තූරයක් Upload කරන්න. ඔබ තෝරාගත් පින්තූරය ${img.width}x${img.height} pixels වේ.`);
            e.target.value = '';
            return;
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          // Compress the image significantly to fit well within Firestore 1MB document limit
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setAdForm(prev => ({ ...prev, image: compressedDataUrl }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdSubmit = (e) => {
    e.preventDefault();
    if (!adForm.image) {
      alert("කරුණාකර පින්තූරයක් තෝරන්න. (Please select an image)");
      return;
    }
    if (editingAdId) {
      updateAd(editingAdId, adForm);
    } else {
      addAd(adForm);
    }
    handleCloseAdModal();
  };

  const handleAdDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Ad?")) {
      deleteAd(id);
    }
  };

  const handleSaveSettings = () => {
    updateSettings({ autoplayInterval: autoplayInterval });
    alert("Autoplay settings saved successfully!");
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    await logout();
    window.location.href = '/';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#111', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '30px 20px', borderBottom: '1px solid #333' }}>
          <img src="/images/Logo_black.png" alt="Nimasa Tex" style={{ height: '40px', filter: 'invert(1)' }} />
          <p style={{ marginTop: '10px', color: '#888', fontSize: '0.85rem' }}>Admin Workspace</p>
        </div>
        
        <nav style={{ flex: 1, padding: '20px 0' }}>
          <div onClick={() => setActiveTab('products')} style={{ padding: '12px 20px', backgroundColor: activeTab === 'products' ? '#222' : 'transparent', borderLeft: activeTab === 'products' ? '4px solid #fff' : '4px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', transition: 'background-color 0.2s' }}>
            <BoxIcon />
            <span style={{ fontWeight: '500' }}>Products</span>
          </div>
          <div onClick={() => setActiveTab('ads')} style={{ padding: '12px 20px', backgroundColor: activeTab === 'ads' ? '#222' : 'transparent', borderLeft: activeTab === 'ads' ? '4px solid #fff' : '4px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', transition: 'background-color 0.2s', marginTop: '5px' }}>
            <ImageIcon />
            <span style={{ fontWeight: '500' }}>Ads / Banners</span>
          </div>
          <div onClick={() => setActiveTab('users')} style={{ padding: '12px 20px', backgroundColor: activeTab === 'users' ? '#222' : 'transparent', borderLeft: activeTab === 'users' ? '4px solid #fff' : '4px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', transition: 'background-color 0.2s', marginTop: '5px' }}>
            <UsersIcon />
            <span style={{ fontWeight: '500' }}>Users</span>
          </div>
          <div onClick={() => setActiveTab('rewards')} style={{ padding: '12px 20px', backgroundColor: activeTab === 'rewards' ? '#222' : 'transparent', borderLeft: activeTab === 'rewards' ? '4px solid #fff' : '4px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', transition: 'background-color 0.2s', marginTop: '5px' }}>
            <GiftIcon />
            <span style={{ fontWeight: '500' }}>Rewards</span>
          </div>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #333' }}>
          <a href="#" onClick={handleSignOut} style={{ color: '#aaa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', transition: 'color 0.2s' }}>
            <LogoutIcon />
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '700', margin: '0 0 5px 0' }}>
              {activeTab === 'products' ? 'Product Inventory' : activeTab === 'ads' ? 'Advertisement Management' : 'Registered Users'}
            </h1>
            <p style={{ color: '#666', margin: 0 }}>
              {activeTab === 'products' ? 'Manage your store products and categories.' : activeTab === 'ads' ? 'Manage your homepage hero banners.' : 'View details of users who have registered on the web.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/" style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#111', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              Back to Store
            </Link>
            {activeTab === 'products' && (
              <button 
                onClick={() => handleOpenModal()} 
                style={{ padding: '10px 20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
              >
                <AddIcon /> Add Product
              </button>
            )}
            {activeTab === 'ads' && (
              <button 
                onClick={() => handleOpenAdModal()} 
                style={{ padding: '10px 20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
              >
                <AddIcon /> Add New Ad
              </button>
            )}
          </div>
        </header>

        {activeTab === 'products' && (
          <>
            {/* Stats Widgets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '12px' }}>
                  <img src="/images/icon_box.png" alt="Products" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Total Products</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{totalProducts}</h3>
                </div>
              </div>
              
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '12px' }}>
                  <img src="/images/icon_tag.png" alt="Categories" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Categories</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{uniqueCategories}</h3>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '12px' }}>
                  <img src="/images/icon_coin.png" alt="Value" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Est. Inventory Value</p>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>{formatPrice(totalValue)}</h3>
                </div>
              </div>
            </div>

            {/* Products Table Section */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>Product Inventory</h2>
                
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888', display: 'flex' }}>
                    <SearchIcon />
                  </span>
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '10px 15px 10px 40px', border: '1px solid #ddd', borderRadius: '20px', width: '250px', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eee', textAlign: 'left', color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '15px 25px', fontWeight: '600' }}>Product</th>
                    <th style={{ padding: '15px 25px', fontWeight: '600' }}>Category</th>
                    <th style={{ padding: '15px 25px', fontWeight: '600' }}>Price</th>
                    <th style={{ padding: '15px 25px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '15px 25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <img src={product.image} alt={product.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <span style={{ fontWeight: '500', color: '#111' }}>{product.title}</span>
                            {product.sizes && product.sizes.length > 0 && (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {product.sizes.map(s => (
                                  <span key={s} style={{ fontSize: '0.75rem', padding: '2px 6px', border: '1px solid #ddd', borderRadius: '4px', color: '#666', backgroundColor: '#fafafa' }}>{s}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '15px 25px' }}>
                        <span style={{ padding: '5px 10px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ padding: '15px 25px', fontWeight: '500', color: '#111' }}>{product.price}</td>
                      <td style={{ padding: '15px 25px', textAlign: 'right' }}>
                        <button onClick={() => handleOpenModal(product)} title="Edit" style={{ padding: '8px', border: 'none', background: 'transparent', color: '#3b82f6', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <EditIcon />
                        </button>
                        <button onClick={() => handleDelete(product.id)} title="Delete" style={{ padding: '8px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s', marginLeft: '5px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                        No products found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Ads Management View */}
        {activeTab === 'ads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Settings Card */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ClockIcon /> Carousel Autoplay Settings
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Set how fast the ads should change on the home page.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                  <input 
                    type="number" 
                    min="1"
                    value={autoplayInterval} 
                    onChange={(e) => setAutoplayInterval(e.target.value)}
                    style={{ padding: '10px 15px', border: 'none', width: '80px', outline: 'none', fontSize: '1rem', textAlign: 'center' }} 
                  />
                  <span style={{ padding: '10px 15px', backgroundColor: '#f8fafc', color: '#64748b', borderLeft: '1px solid #ddd', fontSize: '0.9rem', fontWeight: '500' }}>Seconds</span>
                </div>
                <button onClick={handleSaveSettings} style={{ padding: '10px 20px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                  Save
                </button>
              </div>
            </div>

            {/* Ads List */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>Active Advertisements</h2>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eee', textAlign: 'left', color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '15px 25px', fontWeight: '600' }}>Banner Preview</th>
                    <th style={{ padding: '15px 25px', fontWeight: '600' }}>Title</th>
                    <th style={{ padding: '15px 25px', fontWeight: '600' }}>Target Page</th>
                    <th style={{ padding: '15px 25px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad, index) => (
                    <tr key={ad.id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '15px 25px' }}>
                        <div style={{ position: 'relative', width: '120px', height: '60px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                          <img src={ad.image} alt={ad.titleLine1} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                          <div style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: '#111', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>#{index + 1}</div>
                        </div>
                      </td>
                      <td style={{ padding: '15px 25px' }}>
                        <div style={{ fontWeight: '600', color: '#111' }}>{ad.titleLine1}</div>
                        <div style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '500' }}>{ad.titleLine2}</div>
                      </td>
                      <td style={{ padding: '15px 25px' }}>
                        <span style={{ padding: '4px 10px', background: '#f0f4ff', color: '#3b82f6', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>
                          {(ad.targetPages || (ad.targetPage ? [ad.targetPage] : ['Home'])).join(', ')}
                        </span>
                      </td>
                      <td style={{ padding: '15px 25px', textAlign: 'right' }}>
                        <button onClick={() => handleOpenAdModal(ad)} title="Edit" style={{ padding: '8px', border: 'none', background: 'transparent', color: '#3b82f6', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <EditIcon />
                        </button>
                        <button onClick={() => handleAdDelete(ad.id)} title="Delete" style={{ padding: '8px', border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s', marginLeft: '5px' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ads.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                        No advertisements found. Click "Add New Ad" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Users Management View */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
              <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>Registered Users</h2>
              </div>
              
              {loadingUsers ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Loading users...</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eee', textAlign: 'left', color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <th style={{ padding: '15px 25px', fontWeight: '600' }}>Name</th>
                        <th style={{ padding: '15px 25px', fontWeight: '600' }}>Email</th>
                        <th style={{ padding: '15px 25px', fontWeight: '600' }}>Role</th>
                        <th style={{ padding: '15px 25px', fontWeight: '600' }}>Joined On</th>
                        <th style={{ padding: '15px 25px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbUsers.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '15px 25px', fontWeight: '500', color: '#111' }}>
                            {u.name || 'Unknown'}
                          </td>
                          <td style={{ padding: '15px 25px', color: '#555' }}>
                            {u.email}
                          </td>
                          <td style={{ padding: '15px 25px' }}>
                            <span style={{ 
                              padding: '4px 10px', 
                              backgroundColor: u.role === 'admin' ? '#fee2e2' : '#f0f4ff', 
                              color: u.role === 'admin' ? '#ef4444' : '#3b82f6', 
                              borderRadius: '20px', 
                              fontSize: '0.8rem', 
                              fontWeight: '600' 
                            }}>
                              {u.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td style={{ padding: '15px 25px', color: '#888', fontSize: '0.9rem' }}>
                            {u.createdAt && u.createdAt.seconds 
                              ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() 
                              : 'N/A'}
                          </td>
                          <td style={{ padding: '15px 25px', textAlign: 'right' }}>
                            <button 
                              onClick={async () => {
                                if (window.confirm(`Send password reset email to ${u.email}?`)) {
                                  try {
                                    await resetPassword(u.email);
                                    alert('Password reset email sent successfully!');
                                  } catch (err) {
                                    alert('Failed to send reset email. ' + err.message);
                                  }
                                }
                              }}
                              title="Send Password Reset Email" 
                              style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: '#fff', color: '#111', cursor: 'pointer', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500', transition: 'all 0.2s' }} 
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }} 
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                              Reset Password
                            </button>
                          </td>
                        </tr>
                      ))}
                      {dbUsers.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rewards Tab Content */}
        {activeTab === 'rewards' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#111', margin: '0 0 5px 0' }}>Loyalty Rewards</h1>
                <p style={{ color: '#666', margin: 0, fontSize: '0.95rem' }}>Manage users in the loyalty program</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eee', textAlign: 'left', color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '15px 25px', fontWeight: '600' }}>User</th>
                    <th style={{ padding: '15px 25px', fontWeight: '600' }}>Email</th>
                    <th style={{ padding: '15px 25px', fontWeight: '600' }}>Points</th>
                    <th style={{ padding: '15px 25px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dbUsers.filter(u => u.isLoyaltyMember).map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '15px 25px', fontWeight: '500', color: '#111' }}>{user.name}</td>
                      <td style={{ padding: '15px 25px', color: '#555' }}>{user.email}</td>
                      <td style={{ padding: '15px 25px', color: '#111', fontWeight: '600' }}>{user.points || 0}</td>
                      <td style={{ padding: '15px 25px', textAlign: 'right' }}>
                        <button 
                          onClick={() => fetchUserHistory(user.id)} 
                          style={{ padding: '6px 12px', border: '1px solid #e2e8f0', background: '#fff', color: '#0f172a', cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }} 
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                  {dbUsers.filter(u => u.isLoyaltyMember).length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                        No loyalty program members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Products */}
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ padding: '25px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={handleCloseModal} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer' }}>&times;</button>
              </div>
              
              <div style={{ padding: '30px', maxHeight: '70vh', overflowY: 'auto' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Title</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#ddd'} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Category</label>
                      <select required name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}>
                        <option value="" disabled>Select Main Category</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>{formData.isSale ? 'Offer Price' : 'Price'}</label>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', transition: 'border-color 0.2s' }} onFocus={(e) => e.currentTarget.style.borderColor = '#111'} onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}>
                        <span style={{ padding: '12px 15px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600', borderRight: '1px solid #ddd', fontSize: '0.95rem' }}>LKR</span>
                        <input required type="text" name="price" value={formData.price} onChange={handlePriceChange} placeholder="10,000.00" style={{ width: '100%', padding: '12px 15px', border: 'none', fontSize: '1rem', outline: 'none' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem', color: '#1e293b' }}>
                      <input type="checkbox" name="isSale" checked={formData.isSale} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      Add to "Sale" Category
                    </label>

                    {formData.isSale && (
                      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Original Price (Before Offer)</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', transition: 'border-color 0.2s' }} onFocus={(e) => e.currentTarget.style.borderColor = '#111'} onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}>
                          <span style={{ padding: '12px 15px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600', borderRight: '1px solid #ddd', fontSize: '0.95rem' }}>LKR</span>
                          <input required type="text" name="originalPrice" value={formData.originalPrice} onChange={handleOriginalPriceChange} placeholder="15,000.00" style={{ width: '100%', padding: '12px 15px', border: 'none', fontSize: '1rem', outline: 'none' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem', color: '#1e293b' }}>
                      <input type="checkbox" name="isNewRelease" checked={formData.isNewRelease} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                      Add to "New Releases"
                    </label>
                    
                    {formData.isNewRelease && (
                      <div style={{ marginTop: '15px', animation: 'fadeIn 0.3s ease-out' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Show in New Releases Until:</label>
                        <input required type="date" name="newReleaseExpiry" value={formData.newReleaseExpiry} onChange={handleChange} style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Product will automatically disappear from the New Releases page after this date.</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Product Image</label>
                    <div style={{ border: '2px dashed #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                      <input required={!formData.image} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image')} style={{ marginBottom: '10px', width: '100%' }} />
                      {formData.image && <img src={formData.image} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', marginTop: '10px' }} />}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Description</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="4" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical' }} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#ddd'} placeholder="Enter product details..." />
                  </div>

                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Stock Quantity</label>
                      <input type="number" name="stock" value={formData.stock || ''} onChange={handleChange} min="0" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = '#111'} onBlur={(e) => e.target.style.borderColor = '#ddd'} placeholder="e.g. 50" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Available Sizes</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {['S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(size => (
                        <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', padding: '5px 10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                          <input type="checkbox" checked={formData.sizes?.includes(size)} onChange={() => toggleSize(size)} />
                          {size}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Hover Image (Optional)</label>
                    <div style={{ border: '2px dashed #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hoverImage')} style={{ marginBottom: '10px', width: '100%' }} />
                      {formData.hoverImage && <img src={formData.hoverImage} alt="Hover Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', marginTop: '10px' }} />}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Gallery Images</label>
                    <div style={{ border: '2px dashed #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                      <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ marginBottom: '10px', width: '100%' }} />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                        {formData.gallery?.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            <img src={img} alt="Gallery Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} />
                            <button type="button" onClick={() => removeGalleryImage(idx)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                    <button type="button" onClick={handleCloseModal} style={{ padding: '12px 25px', border: '1px solid #ddd', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                    <button type="submit" style={{ padding: '12px 25px', border: 'none', background: '#111', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Save Product</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Ads */}
        {isAdModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '650px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ padding: '25px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>
                  {editingAdId ? 'Edit Advertisement' : 'Add New Advertisement'}
                </h2>
                <button onClick={handleCloseAdModal} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer' }}>&times;</button>
              </div>
              
              <div style={{ padding: '30px', maxHeight: '70vh', overflowY: 'auto' }}>
                <form onSubmit={handleAdSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Target Pages</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                      {['Home', 'Men', 'Women', 'Kids', 'New Releases', 'Sale', 'Accessories'].map(page => (
                        <label key={page} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
                          <input 
                            type="checkbox" 
                            checked={(adForm.targetPages || (adForm.targetPage ? [adForm.targetPage] : [])).includes(page)} 
                            onChange={() => handleTargetPageToggle(page)} 
                            style={{ cursor: 'pointer' }}
                          />
                          {page}
                        </label>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Select multiple pages to show this same ad on all of them.</p>
                  </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Target Link (Optional)</label>
                      <input type="text" name="button1Link" value={adForm.button1Link || ''} onChange={handleAdChange} placeholder="/sale.html" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                      <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Where should the user go when they click the banner?</p>
                    </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Banner Image</label>
                    <div style={{ border: '2px dashed #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                      <input type={editingAdId && adForm.image ? "file" : "file"} required={!adForm.image} accept="image/*" onChange={handleAdImageUpload} style={{ marginBottom: '10px', width: '100%' }} />
                      {adForm.image && <img src={adForm.image} alt="Preview" style={{ width: '100%', maxWidth: '300px', height: '150px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #ddd', marginTop: '10px', backgroundColor: '#fff' }} />}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                    <button type="button" onClick={handleCloseAdModal} style={{ padding: '12px 25px', border: '1px solid #ddd', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
                    <button type="submit" style={{ padding: '12px 25px', border: 'none', background: '#111', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Save Advertisement</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Reward History */}
        {selectedUserForHistory && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ padding: '20px 25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#111' }}>
                  Reward History
                </h2>
                <button onClick={() => setSelectedUserForHistory(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#888', cursor: 'pointer' }}>&times;</button>
              </div>
              
              <div style={{ padding: '25px', maxHeight: '60vh', overflowY: 'auto' }}>
                {loadingHistory ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Loading history...</div>
                ) : userRewardHistory.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {userRewardHistory.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>{item.reason}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.date ? new Date(item.date.toDate()).toLocaleDateString() : 'Just now'}</div>
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: item.amount > 0 ? '#10b981' : '#ef4444' }}>
                          {item.amount > 0 ? `+${item.amount}` : item.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                    <p style={{ margin: 0 }}>No history found for this user.</p>
                  </div>
                )}
              </div>
              <div style={{ padding: '15px 25px', borderTop: '1px solid #eee', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedUserForHistory(null)} style={{ padding: '10px 20px', border: '1px solid #ddd', background: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Close</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
