const fs = require('fs');
const path = require('path');

const filesToProcess = [
  { name: 'Home.jsx', filter: '', arrayName: 'products' },
  { name: 'Men.jsx', filter: '.filter(p => p.category.includes("Men"))', arrayName: 'menProducts' },
  { name: 'Women.jsx', filter: '.filter(p => p.category.includes("Women"))', arrayName: 'products' },
  { name: 'Kids.jsx', filter: '.filter(p => p.category.includes("Kid"))', arrayName: 'products' },
  { name: 'Sale.jsx', filter: '.slice(0, 4)', arrayName: 'products' },
  { name: 'NewReleases.jsx', filter: '.slice(0, 4)', arrayName: 'products' }
];

filesToProcess.forEach(fileInfo => {
  const filePath = path.join(__dirname, 'src', 'pages', fileInfo.name);
  let content = fs.readFileSync(filePath, 'utf8');

  // Add import
  if (!content.includes('useProduct')) {
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { useProduct } from '../context/ProductContext';");
  }

  // Remove the hardcoded array
  const regex = new RegExp(`const\\s+${fileInfo.arrayName}\\s*=\\s*\\[.*?\\];`, 's');
  content = content.replace(regex, '');

  // Inject hook inside the component
  const componentName = fileInfo.name.replace('.jsx', '');
  const hookRegex = new RegExp(`const\\s+${componentName}\\s*=\\s*\\(\\)\\s*=>\\s*{`);
  
  if (fileInfo.filter) {
     content = content.replace(hookRegex, `const ${componentName} = () => {\n  const { products: allProducts } = useProduct();\n  const ${fileInfo.arrayName} = allProducts${fileInfo.filter};`);
  } else {
     content = content.replace(hookRegex, `const ${componentName} = () => {\n  const { products } = useProduct();`);
  }

  fs.writeFileSync(filePath, content);
  console.log('Processed', fileInfo.name);
});
