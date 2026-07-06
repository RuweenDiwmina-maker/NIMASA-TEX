import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

console.log("--- SEARCHING FOR LOADER USAGES ---");
walkDir('src', (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('Loader')) {
      console.log(`Found in: ${filePath}`);
      // print matching lines
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('Loader')) {
          console.log(`  ${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
});
