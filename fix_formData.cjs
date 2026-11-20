const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const oldFormData = "['title', 'titleRw', 'description', 'descriptionRw', 'type', 'transactionType', 'condition', 'area', 'location', 'locationRw', 'city', 'address', 'contactPhone', 'contactEmail', 'upi', 'ownerPrice', 'images', 'videos']";
const newFormData = "['title', 'description', 'type', 'transactionType', 'condition', 'area', 'location', 'city', 'address', 'contactPhone', 'contactEmail', 'upi', 'ownerPrice', 'images', 'videos']";
content = content.replace(oldFormData, newFormData);
fs.writeFileSync('src/pages/Dashboard.jsx', content);
console.log('Done');