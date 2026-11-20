const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

// Remove locationRw field
const locRwRegex = /<div className="xl:col-span-2">\s*<label[^>]*>{t\('dash\.propLocationRw'\)}<\/label>\s*<input[^>]*value=\{form\.locationRw\}[^>]*\/>\s*<\/div>\s*/g;
content = content.replace(locRwRegex, '');

// Remove titleRw field
const titleRwRegex = /<div className="xl:col-span-3">\s*<label[^>]*>{t\('dash\.propTitleRw'\)}<\/label>\s*<input[^>]*value=\{form\.titleRw\}[^>]*\/>\s*<\/div>\s*/g;
content = content.replace(titleRwRegex, '');

// Remove descriptionRw field
const descRwRegex = /<div className="xl:col-span-3">\s*<label[^>]*>{t\('dash\.propDescriptionRw'\)}<\/label>\s*<textarea[^>]*value=\{form\.descriptionRw\}[^>]*><\/textarea>\s*<\/div>\s*/g;
content = content.replace(descRwRegex, '');

fs.writeFileSync('src/pages/Dashboard.jsx', content);
console.log('Done');