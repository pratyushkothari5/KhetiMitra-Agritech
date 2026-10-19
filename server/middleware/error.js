exports.notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500, message = err.message;
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors)[0].message; }
  if (err.code === 11000) { status = 400; message = 'Duplicate value: ' + Object.keys(err.keyValue).join(', '); }
  if (err.name === 'CastError') { status = 400; message = 'Invalid id'; }
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${status} ${message}`);
  res.status(status).json({ message });
};
