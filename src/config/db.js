const mongoose = require('mongoose');

const dbOptions = {
  maxPoolSize: 10 // Set the pool size as needed
};

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, dbOptions);
    console.log('mongodb is connected successfully :)');
  } catch (e) {
    console.log('mongo connection failed', e);
    process.exit(1);
  }
};

module.exports = connectToDb;
