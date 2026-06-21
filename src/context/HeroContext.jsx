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
  },
  {
    id: 2,
    titleLine1: 'NEW',
    titleLine2: 'RELEASES',
    subtitle: 'Be the first to wear our cutting-edge drops.',
    image: '/images/new_releases_hero_1779900201787.png',
    button1Text: 'Shop New Arrivals',
    button1Link: '/new-releases.html',
    button2Text: 'Shop All',
    button2Link: '/new-releases.html',
    targetPage: 'New Releases'
  },
  {
    id: 3,
    titleLine1: 'SALE',
    titleLine2: '',
    subtitle: 'Don\'t miss out on premium gear at reduced prices.',
    image: '/images/sale_hero_1779900247375.png',
    button1Text: 'Shop New Arrivals',
    button1Link: '/new-releases.html',
    button2Text: 'Shop All Sale',
    button2Link: '/sale.html',
    targetPage: 'Sale'
  },
  {
    id: 4,
    titleLine1: 'KIDS',
    titleLine2: '',
    subtitle: 'Gear up the next generation of athletes.',
    image: '/images/kids_hero_1779900231979.png',
    button1Text: 'Shop New Arrivals',
    button1Link: '/new-releases.html',
    button2Text: 'Shop All Kids',
    button2Link: '/kids.html',
    targetPage: 'Kids'
  },
  {
    id: 5,
    titleLine1: 'MEN',
    titleLine2: '',
    subtitle: 'Elevate your everyday style.',
    image: '/images/men_hero_1779898328198.png',
    button1Text: 'Shop Men',
    button1Link: '/men.html',
    button2Text: 'New Arrivals',
    button2Link: '/new-releases.html',
    targetPage: 'Men'
  },
  {
    id: 6,
    titleLine1: 'WOMEN',
    titleLine2: '',
    subtitle: 'Discover the latest trends.',
    image: '/images/women_hero_1779900217677.png',
    button1Text: 'Shop Women',
    button1Link: '/women.html',
    button2Text: 'New Arrivals',
    button2Link: '/new-releases.html',
    targetPage: 'Women'
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
      const migrated = [{ ...parsedOld, id: 1, targetPage: 'Home' }];
      ['New Releases', 'Sale', 'Kids', 'Men', 'Women'].forEach(page => {
        const ad = defaultAds.find(a => a.targetPage === page);
        if (ad) migrated.push(ad);
      });
      return migrated;
    }
    if (savedAds) {
      let parsed = JSON.parse(savedAds);
      parsed = parsed.map(ad => ad.targetPage ? ad : { ...ad, targetPage: 'Home' });
      ['New Releases', 'Sale', 'Kids', 'Men', 'Women'].forEach(page => {
        const hasAd = parsed.some(ad => ad.targetPage === page);
        if (!hasAd) {
          const defaultAd = defaultAds.find(ad => ad.targetPage === page);
          if (defaultAd) parsed.push(defaultAd);
        }
      });
      return parsed;
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
