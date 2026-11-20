const fs = require('fs');
let content = fs.readFileSync('src/i18n/translations.js', 'utf8');
const oldLine = "'dash.propType': 'Ubwoko bw'Umutungo *',";
const newLine = "'dash.propType': 'Ubwoko bw'Umutungo *',\n    'dash.propTransactionType': 'Ubwoko bwo Gukora Igenzura *',\n    'dash.propForSale': 'Kugurisha',\n    'dash.propForRent': 'Gukodesha',\n    'dash.propCondition': 'Imiterere *',\n    'dash.propNew': 'Gihya',\n    'dash.propUsed': 'Yasanzwe',";
content = content.replace(oldLine, newLine);
fs.writeFileSync('src/i18n/translations.js', content);
console.log('Done');