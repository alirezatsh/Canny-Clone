const ConnectToDb = require('./src/config/db');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('uncaughtException...shutting dowm...');
  process.exit(1);
});

ConnectToDb();

const server = app.listen(process.env.PORT, () => {
  console.log('app is running.');
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandledRejection...shutting dowm...');
  server.close(() => {
    process.exit(1);
  });
});
