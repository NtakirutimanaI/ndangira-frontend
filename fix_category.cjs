const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');
const oldLine = "{({ rent: 'For Rent', sale: 'For Sale', new: 'New', used: 'Used' })[p.category] || p.category)}";
const newLine = "{p.transactionType === 'sale' ? t('dash.propForSale') : t('dash.propForRent')} · {p.condition === 'new' ? t('dash.propNew') : t('dash.propUsed')}";
content = content.replace(oldLine, newLine);
fs.writeFileSync('src/pages/Dashboard.jsx', content);
console.log('Done');