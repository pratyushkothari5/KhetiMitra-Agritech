const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

module.exports = async () => {
  const configuredUri = process.env.MONGO_URI;
  try {
    await mongoose.connect(configuredUri);
    console.log('MongoDB connected:', mongoose.connection.host);
  } catch (error) {
    const isLocalDefault = !configuredUri || configuredUri === 'mongodb://127.0.0.1:27017/agritech';
    if (!isLocalDefault) throw error;

    console.warn('Local MongoDB is unavailable; starting embedded development MongoDB.');
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri('agritech'));
    console.log('Embedded MongoDB connected:', mongoose.connection.host);
  }
};

process.once('SIGINT', async () => {
  await memoryServer?.stop();
  await mongoose.disconnect();
  process.exit(0);
});
