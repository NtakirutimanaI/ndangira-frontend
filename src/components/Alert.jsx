export const Alert = ({ type = 'error', message }) => {
  const classes = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700';
  return <div className={`${classes} p-4 rounded border mb-4 text-sm`}>{message}</div>;
};
