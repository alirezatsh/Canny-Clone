const connectToDb = require('./src/config/db');
const app = require('./app');

connectToDb();

app.listen(process.env.PORT, () => {
  console.log('app is running.');
});
