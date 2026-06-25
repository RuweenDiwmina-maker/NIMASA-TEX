import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

const ProductListing = ({ products, title }) => {
  const [viewMode, setViewMode] = useState(4);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('featured');

  const getNumericPrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(priceStr.replace(/[^0-9.-]+/g,""));
  };

  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch (sortOption) {
      case 'price-low':
        sorted.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
        break;
      case 'price-high':
        sorted.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
        break;
      case 'az':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        sorted.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.id - b.id);
        break;
      case 'featured':
      case 'relevant':
      case 'best-selling':
      default:
        break;
    }
    return sorted;
  }, [products, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="product-listing-container">
      {title && <h2 className="nike-section-title">{title}</h2>}
      
      <div className="product-toolbar">
        <div className="toolbar-left">
          <span className="toolbar-label">VIEW AS</span>
          <div className="view-icons">
             <button className={viewMode === 2 ? 'active' : ''} onClick={() => setViewMode(2)}>
               <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M4 4h7v16H4V4zm9 0h7v16h-7V4z"/></svg>
             </button>
             <button className={viewMode === 3 ? 'active' : ''} onClick={() => setViewMode(3)}>
               <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M3 4h4v16H3V4zm6 0h5v16H9V4zm7 0h5v16h-5V4z"/></svg>
             </button>
             <button className={viewMode === 4 ? 'active' : ''} onClick={() => setViewMode(4)}>
               <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M2 4h4v16H2V4zm5 0h4v16H7V4zm5 0h4v16h-4V4zm5 0h5v16h-5V4z"/></svg>
             </button>
          </div>
        </div>
        
        <div className="toolbar-right">
          <div className="toolbar-group">
            <label className="toolbar-label">ITEMS PER PAGE</label>
            <select 
              value={itemsPerPage} 
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="toolbar-select"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="50">50</option>
            </select>
          </div>
          
          <div className="toolbar-group">
            <label className="toolbar-label">SORT BY</label>
            <select 
              value={sortOption} 
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              className="toolbar-select"
            >
              <option value="featured">Featured</option>
              <option value="relevant">Most relevant</option>
              <option value="best-selling">Best selling</option>
              <option value="az">Alphabetically, A-Z</option>
              <option value="za">Alphabetically, Z-A</option>
              <option value="price-low">Price, low to high</option>
              <option value="price-high">Price, high to low</option>
              <option value="oldest">Date, old to new</option>
              <option value="newest">Date, new to old</option>
            </select>
          </div>
        </div>
      </div>

      <div 
        className="nike-product-grid dynamic-grid" 
        style={{ '--col-count': viewMode }}
      >
        {currentProducts.map(p => <ProductCard key={p.id} product={p} isNikeStyle={true} />)}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1} 
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>
          
          <span className="page-info">Page {currentPage} of {totalPages}</span>
          
          <button 
            disabled={currentPage === totalPages} 
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
