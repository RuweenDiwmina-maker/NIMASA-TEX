import React, { createContext, useState, useContext, useEffect } from 'react';

const defaultAds = [
  {
    id: 1,
    titleLine1: 'ELEVATE',
    titleLine2: 'YOUR STYLE',
    subtitle: 'Discover the new premium collection. Crafted for the bold. Experience comfort and cutting-edge fashion combined.',
    image: '/images/hero_banner_1779816577403.png',
    button1Text: 'Shop Collection',
    button1Link: '/new-releases.html',
    button2Text: 'Explore',
    button2Link: '/men.html',
    targetPage: 'Home'
  }
];

const defaultSettings = {
  autoplayInterval: 5 // seconds
};

const HeroContext = createContext(null);

export const HeroProvider = ({ children }) => {
  const [ads, setAds] = useState(() => {
    const savedAds = localStorage.getItem('nimasaAds');
    // Migration from old heroData
    const oldHeroData = localStorage.getItem('nimasaHeroData');
    if (!savedAds && oldHeroData) {
      const parsedOld = JSON.parse(oldHeroData);
      return [{ ...parsedOld, id: 1, targetPage: 'Home' }];
    }
    if (savedAds) {
      const parsed = JSON.parse(savedAds);
      return parsed.map(ad => ad.targetPage ? ad : { ...ad, targetPage: 'Home' });
    }
    return defaultAds;
  });

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('nimasaAdSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('nimasaAds', JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem('nimasaAdSettings', JSON.stringify(settings));
  }, [settings]);

  const addAd = (adData) => {
    setAds([...ads, { ...adData, id: Date.now() }]);
  };

  const updateAd = (id, adData) => {
    setAds(ads.map(ad => ad.id === id ? { ...adData, id } : ad));
  };

  const deleteAd = (id) => {
    setAds(ads.filter(ad => ad.id !== id));
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <HeroContext.Provider value={{ ads, settings, addAd, updateAd, deleteAd, updateSettings }}>
      {children}
    </HeroContext.Provider>
  );
};

export const useHero = () => {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error('useHero must be used within a HeroProvider');
  }
  return context;
};
