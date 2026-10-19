require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User'), Farm = require('./models/Farm'), Crop = require('./models/Crop'), Product = require('./models/Product'), Post = require('./models/Post');
(async () => {
  await connectDB();
  await Promise.all([User, Farm, Crop, Product, Post].map(M => M.deleteMany()));
  await User.create({ name: 'Admin', email: 'admin@agritech.in', password: 'Admin@123', role: 'admin' });
  const f = await User.create({ name: 'Ramesh Patel', email: 'ramesh@farm.in', password: 'Farmer@123', location: 'Bhopal' });
  const farm = await Farm.create({ owner: f.id, name: 'Narmada Field', location: 'Bhopal', areaAcres: 12, soilType: 'Black' });
  await Crop.create([
    { owner: f.id, farm: farm.id, name: 'Wheat', season: 'Rabi', status: 'growing', expectedYield: 4.6, soilPh: 6.8, soilNitrogen: 200, soilMoisture: 62 },
    { owner: f.id, farm: farm.id, name: 'Soybean', season: 'Kharif', status: 'harvested', expectedYield: 2.4 },
    { owner: f.id, farm: farm.id, name: 'Mustard', season: 'Rabi', status: 'planned', expectedYield: 1.8 }]);
  await Product.create([
    { name: 'Hybrid wheat seed', category: 'Seeds', price: 42, unit: 'kg', emoji: '🌱' },
    { name: 'NPK 19-19-19', category: 'Fertiliser', price: 1250, unit: 'bag', emoji: '🧪' },
    { name: 'Neem pesticide', category: 'Pesticide', price: 380, unit: 'litre', emoji: '🍃' },
    { name: 'Drip irrigation kit', category: 'Equipment', price: 14500, unit: 'acre', emoji: '💧' }]);
  await Post.create({ author: f.id, authorName: f.name, text: 'Best time to sow wheat after soybean?', kind: 'question' });
  console.log('Seeded. Admin: admin@agritech.in / Admin@123 | Farmer: ramesh@farm.in / Farmer@123');
  process.exit(0);
})();
