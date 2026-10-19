const { validationResult } = require('express-validator');
module.exports = (req, res, next) => {
  const e = validationResult(req);
  if (!e.isEmpty()) return res.status(400).json({ message: e.array()[0].msg });
  next();
};
