const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

let html = fs.readFileSync(indexPath, 'utf8');

// Add type="module" to script tags that don't have it
html = html.replace(
  /<script src="(\/_expo\/static\/js\/web\/[^"]+\.js)" defer><\/script>/g,
  '<script src="$1" defer type="module"></script>'
);

fs.writeFileSync(indexPath, html);
console.log('Fixed index.html: added type="module" to script tags');
