const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sign = u => jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = u => ({ id: u.id, name: u.name, email: u.email, role: u.role, language: u.language, location: u.location });
exports.register = async (req, res) => {
  const { name, email, password, phone, location, language } = req.body;
  const user = await User.create({ name, email, password, phone, location, language, role: 'farmer' }); // public signup = farmer only
  res.status(201).json({ token: sign(user), user: out(user) });
};
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await user.matchPassword(req.body.password))) return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: sign(user), user: out(user) });
};
exports.me = async (req, res) => res.json(out(await User.findById(req.user.id)));
