import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useHero } from '../context/HeroContext';

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

const ClockIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProduct();
  const { ads, settings, addAd, updateAd, deleteAd, updateSettings } = useHero();

  const [activeTab, setActiveTab] = useState('products');
  
  // Product State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '', category: '', price: '', image: '', hoverImage: '', isNewRelease: false, newReleaseExpiry: ''
  });

  // Ad State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const [adForm, setAdForm] = useState({
    titleLine1: '', titleLine2: '', subtitle: '', image: '', button1Text: '', button1Link: '', button2Text: '', button2Link: '', targetPage: 'Home', adType: 'custom'
  });
  const [autoplayInterval, setAutoplayInterval] = useState(settings.autoplayInterval || 5);

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
        newReleaseExpiry: product.newReleaseExpiry || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '', category: '', price: '', image: '', hoverImage: '', isNewRelease: false, newReleaseExpiry: ''
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

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanPriceStr = formData.price.replace(/,/g, '');
    const numericPrice = parseFloat(cleanPriceStr);
    const formattedPrice = isNaN(numericPrice) 
      ? formData.price 
      : new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(numericPrice).replace('LKR', 'LKR\u00A0');

    const productDataToSave = { ...formData, price: formattedPrice };

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
      setAdForm({ titleLine1: '', titleLine2: '', subtitle: '', image: '', button1Text: '', button1Link: '', button2Text: '', button2Link: '', targetPage: 'Home', adType: 'custom' });
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

  const handleAdImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdSubmit = (e) => {
    e.preventDefault();
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

  const handleSignOut = (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#111', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '30px 20px', borderBottom: '1px solid #333' }}>
          <img src="/src/assets/Logo_black.png" alt="Nimasa Tex" style={{ height: '40px', filter: 'invert(1)' }} />
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
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111', margin: 0 }}>
              {activeTab === 'products' ? 'Product Inventory' : 'Advertisement Management'}
            </h1>
            <p style={{ color: '#666', marginTop: '5px' }}>Welcome back, System Admin.</p>
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
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#f0f4ff', color: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <BoxIcon />
                </div>
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Total Products</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{totalProducts}</h3>
                </div>
              </div>
              
              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#fff0f5', color: '#ec4899', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <TagsIcon />
                </div>
                <div>
                  <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 5px 0' }}>Categories</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{uniqueCategories}</h3>
                </div>
              </div>

              <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <DollarIcon />
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
                          <span style={{ fontWeight: '500', color: '#111' }}>{product.title}</span>
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
                        <span style={{ padding: '5px 10px', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>
                          {ad.targetPage || 'Home'}
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
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Price</label>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white', transition: 'border-color 0.2s' }} onFocus={(e) => e.currentTarget.style.borderColor = '#111'} onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}>
                        <span style={{ padding: '12px 15px', backgroundColor: '#f8fafc', color: '#475569', fontWeight: '600', borderRight: '1px solid #ddd', fontSize: '0.95rem' }}>LKR</span>
                        <input required type="text" name="price" value={formData.price} onChange={handlePriceChange} placeholder="10,000.00" style={{ width: '100%', padding: '12px 15px', border: 'none', fontSize: '1rem', outline: 'none' }} />
                      </div>
                    </div>
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
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Hover Image (Optional)</label>
                    <div style={{ border: '2px dashed #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fafafa' }}>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hoverImage')} style={{ marginBottom: '10px', width: '100%' }} />
                      {formData.hoverImage && <img src={formData.hoverImage} alt="Hover Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', marginTop: '10px' }} />}
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
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Ad Type</label>
                    <div style={{ display: 'flex', gap: '20px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
                        <input type="radio" name="adType" value="custom" checked={adForm.adType !== 'full'} onChange={handleAdChange} />
                        Customize Ad (Text & Buttons)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
                        <input type="radio" name="adType" value="full" checked={adForm.adType === 'full'} onChange={handleAdChange} />
                        Full Image Ad (No Text)
                      </label>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Target Page</label>
                    <select required name="targetPage" value={adForm.targetPage} onChange={handleAdChange} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}>
                      <option value="Home">Home</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="New Releases">New Releases</option>
                      <option value="Sale">Sale</option>
                    </select>
                  </div>

                  {adForm.adType !== 'full' ? (
                    <>
                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Heading Line 1</label>
                          <input required type="text" name="titleLine1" value={adForm.titleLine1} onChange={handleAdChange} placeholder="e.g. ELEVATE" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Heading Line 2 (Highlighted)</label>
                          <input required type="text" name="titleLine2" value={adForm.titleLine2} onChange={handleAdChange} placeholder="e.g. YOUR STYLE" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Subtitle / Description</label>
                        <textarea required name="subtitle" value={adForm.subtitle} onChange={handleAdChange} rows="3" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none', resize: 'vertical' }}></textarea>
                      </div>

                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Primary Button Text</label>
                          <input required type="text" name="button1Text" value={adForm.button1Text} onChange={handleAdChange} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Primary Button Link</label>
                          <input required type="text" name="button1Link" value={adForm.button1Link} onChange={handleAdChange} placeholder="/new-releases.html" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Secondary Button Text</label>
                          <input required type="text" name="button2Text" value={adForm.button2Text} onChange={handleAdChange} style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Secondary Button Link</label>
                          <input required type="text" name="button2Link" value={adForm.button2Link} onChange={handleAdChange} placeholder="/men.html" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: '#444' }}>Target Link (Optional)</label>
                      <input type="text" name="button1Link" value={adForm.button1Link || ''} onChange={handleAdChange} placeholder="/sale.html" style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outline: 'none' }} />
                      <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Where should the user go when they click the banner?</p>
                    </div>
                  )}

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

      </main>
    </div>
  );
};

export default AdminDashboard;
