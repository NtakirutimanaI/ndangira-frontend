const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

const oldHandleEdit = `const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || '', titleRw: p.titleRw || '', description: p.description || '', descriptionRw: p.descriptionRw || '',
      type: p.type || 'house', transactionType: p.transactionType || 'sale', condition: p.condition || 'new',
      area: p.area || '', location: p.location || '', locationRw: p.locationRw || '', city: p.city || 'Kigali', address: p.address || '',
      contactPhone: p.contactPhone || '', contactEmail: p.contactEmail || '', upi: p.upi || '',
      ownerPrice: p.ownerPrice || '',
      images: [], videos: [],
    });
    setShowForm(true);
  };`;

const newHandleEdit = `const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || '', description: p.description || '',
      type: p.type || 'house', transactionType: p.transactionType || 'sale', condition: p.condition || 'new',
      area: p.area || '', location: p.location || '', city: p.city || 'Kigali', address: p.address || '',
      contactPhone: p.contactPhone || '', contactEmail: p.contactEmail || '', upi: p.upi || '',
      ownerPrice: p.ownerPrice || '',
      images: [], videos: [],
    });
    setShowForm(true);
  };`;

content = content.replace(oldHandleEdit, newHandleEdit);
fs.writeFileSync('src/pages/Dashboard.jsx', content);
console.log('Done');