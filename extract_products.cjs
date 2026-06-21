const fs = require('fs');
const path = require('path');

const files = [
  'Home.jsx', 'Men.jsx', 'Women.jsx', 'Kids.jsx', 'Sale.jsx', 'NewReleases.jsx'
];

let allProducts = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(__dirname, 'src', 'pages', file), 'utf8');
  // Match `const ...products = [...]`
  const match = content.match(/const\s+\w*(?:P|p)roducts\s*=\s*(\[[^\]]+\]);/s);
  if (match) {
    try {
      // Evaluate the array using a simple new Function to parse it into an object
      const arr = new Function(`return ${match[1]}`)();
      
      // Add a page source property to help with initial categorization if needed
      arr.forEach(p => {
        p.sourcePage = file.replace('.jsx', '');
        allProducts.push(p);
      });
    } catch (e) {
      console.error('Failed to parse in', file, e.message);
    }
  }
});

// Remove duplicates by ID
const uniqueProducts = [];
const seenIds = new Set();
allProducts.forEach(p => {
  if (!seenIds.has(p.id)) {
    seenIds.add(p.id);
    uniqueProducts.push(p);
  }
});

console.log(JSON.stringify(uniqueProducts, null, 2));
