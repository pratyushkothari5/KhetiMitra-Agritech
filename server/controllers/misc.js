const Post = require('../models/Post'), Product = require('../models/Product'), User = require('../models/User');
const Farm = require('../models/Farm'), Crop = require('../models/Crop'), Order = require('../models/Order');
exports.posts = async (req, res) => res.json(await Post.find().sort('-createdAt').limit(50));
exports.addPost = async (req, res) => res.status(201).json(await Post.create({ author: req.user.id, authorName: req.user.name, text: req.body.text, kind: req.body.kind }));
exports.delPost = async (req, res) => { await Post.findByIdAndDelete(req.params.id); res.json({ deleted: true }); };
exports.products = async (req, res) => res.json(await Product.find().sort('name'));
exports.addProduct = async (req, res) => res.status(201).json(await Product.create(req.body));
exports.updProduct = async (req, res) => res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }));
exports.delProduct = async (req, res) => { await Product.findByIdAndDelete(req.params.id); res.json({ deleted: true }); };
exports.users = async (req, res) => res.json(await User.find().sort('-createdAt'));
exports.delUser = async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ message: 'You cannot delete yourself' });
  await User.findByIdAndDelete(req.params.id); res.json({ deleted: true });
};
exports.stats = async (req, res) => res.json({ users: await User.countDocuments(), farms: await Farm.countDocuments(), crops: await Crop.countDocuments(), orders: await Order.countDocuments(), pendingOrders: await Order.countDocuments({ status: 'pending' }) });
exports.dashboard = async (req, res) => {
  const own = req.user.role === 'admin' ? {} : { owner: req.user.id };
  const crops = await Crop.find(own).select('name expectedYield status');
  res.json({
    farms: await Farm.countDocuments(own), crops: crops.length,
    orders: await Order.countDocuments(req.user.role === 'admin' ? {} : { user: req.user.id }),
    yieldByCrop: crops.map(c => ({ name: c.name, yield: c.expectedYield }))
  });
};
