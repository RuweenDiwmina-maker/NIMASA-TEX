import React, { useState, useEffect } from 'react';
import { useHero } from '../context/HeroContext';
import { useNavigate } from 'react-router-dom';

const HeroCarousel = ({ targetPage = 'Home' }) => {
  const { ads, settings } = useHero();
  const navigate = useNavigate();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const pageAds = ads ? ads.filter(ad => {
    const pages = ad.targetPages || (ad.targetPage ? [ad.targetPage] : ['Home']);
    return pages.includes(targetPage);
  }) : [];

  useEffect(() => {
    setCurrentAdIndex(0);
  }, [pageAds.length]);

  useEffect(() => {
    if (!pageAds || pageAds.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % pageAds.length);
    }, (settings.autoplayInterval || 5) * 1000);

    return () => clearInterval(intervalId);
  }, [pageAds, settings.autoplayInterval]);

  if (!pageAds || pageAds.length === 0) {
    return null;
  }

  return (
    <header className="hero" style={{ 
      position: 'relative', 
      height: 'auto', 
      minHeight: 'auto', 
      display: 'block',
      marginTop: '119px',
      overflow: 'hidden'
    }}>
      {pageAds.map((ad, index) => {
        const isFull = ad.adType === 'full';
        const isActive = index === currentAdIndex;
        
        return (
          <div 
            key={ad.id} 
            className={`hero-slide ${isActive ? 'active' : ''}`}
            style={{ 
              position: isActive ? 'relative' : 'absolute', 
              top: 0, left: 0, width: '100%', 
              height: isActive ? 'auto' : '100%', 
              opacity: isActive ? 1 : 0, 
              transition: 'opacity 0.8s ease-in-out',
              pointerEvents: isActive ? 'auto' : 'none',
              zIndex: isActive ? 2 : 1,
              display: isFull ? 'block' : 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            {isFull ? (
              <div 
                className="hero-bg" 
                style={{ 
                  cursor: ad.button1Link ? 'pointer' : 'default', 
                  position: 'relative',
                  height: 'auto', 
                  width: '100%',
                  backgroundColor: 'transparent'
                }}
                onClick={() => ad.button1Link && navigate(ad.button1Link)}
              >
                <img 
                  src={ad.image} 
                  alt={ad.targetPage || 'Ad'} 
                  className="hero-image" 
                  style={{ 
                    objectFit: 'contain',
                    objectPosition: 'center',
                    width: '100%', 
                    height: 'auto',
                    display: 'block',
                    padding: 0
                  }} 
                />
              </div>
            ) : (
              <>
                <div className="hero-bg">
                  <img src={ad.image} alt={ad.titleLine1} className="hero-image" style={{ objectFit: 'cover', objectPosition: 'center', padding: 0 }} />
                  <div className="overlay"></div>
                </div>
                <div className="hero-content" style={{ position: 'relative', zIndex: 3 }}>
                  <h1 className="hero-title">{ad.titleLine1}<br/><span className="text-red">{ad.titleLine2}</span></h1>
                  <p className="hero-subtitle">{ad.subtitle}</p>
                  <div className="hero-buttons">
                    <button className="btn btn-primary" onClick={() => navigate(ad.button1Link)}>{ad.button1Text}</button>
                    <button className="btn btn-secondary" onClick={() => navigate(ad.button2Link)}>{ad.button2Text}</button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}

      {pageAds.length > 1 && (
        <div style={{ position: 'absolute', bottom: '20px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', gap: '12px', zIndex: 10 }}>
          {pageAds.map((_, index) => (
            <button 
              key={index} 
              onClick={() => setCurrentAdIndex(index)}
              style={{ 
                width: index === currentAdIndex ? '30px' : '12px', 
                height: '12px', 
                borderRadius: '6px', 
                border: 'none', 
                cursor: 'pointer',
                backgroundColor: index === currentAdIndex ? '#ef4444' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease-in-out',
                padding: 0
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </header>
  );
};

export default HeroCarousel;
