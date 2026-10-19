const Order = require('../models/Order'), Product = require('../models/Product');
exports.create = async (req, res) => {
  const lines = req.body.items || [];
  if (!lines.length) return res.status(400).json({ message: 'Cart is empty' });
  const items = [];
  for (const l of lines) {
    const p = await Product.findById(l.product);
    if (!p) return res.status(400).json({ message: 'Product not found' });
    items.push({ product: p.id, name: p.name, price: p.price, qty: Math.max(1, Number(l.qty) || 1) });
  }
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  res.status(201).json(await Order.create({ user: req.user.id, items, total }));
};
exports.list = async (req, res) => res.json(await Order.find(req.user.role === 'admin' ? {} : { user: req.user.id }).populate('user', 'name email').sort('-createdAt'));
exports.setStatus = async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  o ? res.json(o) : res.status(404).json({ message: 'Order not found' });
};
