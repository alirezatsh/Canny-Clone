const connectToDb = require('./src/config/db');
const app = require('./app');

const startServer = async () => {
  await connectToDb();
  app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`);
  });
};

startServer();
