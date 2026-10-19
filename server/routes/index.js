const r = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');
const auth = require('../controllers/auth'), soil = require('../controllers/soil'), wx = require('../controllers/weather');
const orders = require('../controllers/orders'), m = require('../controllers/misc');
const crud = require('../controllers/crud');
const Farm = require('../models/Farm'), Crop = require('../models/Crop');
const farms = crud(Farm, ['name', 'location', 'areaAcres', 'soilType']);
const crops = crud(Crop, ['farm', 'name', 'season', 'sownOn', 'status', 'expectedYield', 'soilPh', 'soilNitrogen', 'soilMoisture'], 'farm');

// Auth
r.post('/auth/register', [body('name').notEmpty().withMessage('Name required'), body('email').isEmail().withMessage('Valid email required'), body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')], validate, auth.register);
r.post('/auth/login', [body('email').isEmail().withMessage('Valid email required'), body('password').notEmpty().withMessage('Password required')], validate, auth.login);
r.get('/auth/me', protect, auth.me);
// Farms & crops
r.route('/farms').get(protect, farms.list).post(protect, [body('name').notEmpty().withMessage('Farm name required')], validate, farms.create);
r.route('/farms/:id').put(protect, farms.update).delete(protect, farms.remove);
r.post('/crops/analyse-soil', protect, soil.analyse);
r.route('/crops').get(protect, crops.list).post(protect, [body('name').notEmpty().withMessage('Crop name required'), body('farm').notEmpty().withMessage('Select a farm')], validate, crops.create);
r.route('/crops/:id').put(protect, crops.update).delete(protect, crops.remove);
// Weather & pests
r.get('/weather', protect, wx.forecast);
r.get('/weather/alerts', protect, wx.alerts);
r.post('/weather', protect, adminOnly, wx.add);
// Marketplace
r.get('/products', protect, m.products);
r.post('/products', protect, adminOnly, m.addProduct);
r.route('/products/:id').put(protect, adminOnly, m.updProduct).delete(protect, adminOnly, m.delProduct);
r.route('/orders').get(protect, orders.list).post(protect, orders.create);
r.put('/orders/:id/status', protect, adminOnly, orders.setStatus);
// Community
r.route('/posts').get(protect, m.posts).post(protect, [body('text').notEmpty().withMessage('Text required')], validate, m.addPost);
r.delete('/posts/:id', protect, adminOnly, m.delPost);
// Dashboard & admin
r.get('/dashboard', protect, m.dashboard);
r.get('/admin/stats', protect, adminOnly, m.stats);
r.get('/admin/users', protect, adminOnly, m.users);
r.delete('/admin/users/:id', protect, adminOnly, m.delUser);
module.exports = r;
