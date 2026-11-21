export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');
  // If URL doesn't start with /, prepend /uploads/
  const path = url.startsWith('/') ? url : `/uploads/${url}`;
  return `${apiUrl}${path}`;
};