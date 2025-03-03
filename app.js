require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./src/swagger.json');
const ConnectToDb = require('./src/config/db');
const PostRoutes = require('./src/routes/v1/post-route');
const AuthRoutes = require('./src/routes/v1/auth-route');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      logger.error(
        `Request failed: ${req.method} ${req.originalUrl} - ${res.statusCode}`
      );
    } else {
      logger.info(
        `Request success: ${req.method} ${req.originalUrl} - ${res.statusCode}`
      );
    }
  });
  next();
});
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(express.json());

ConnectToDb();

app.use('/', PostRoutes, AuthRoutes);

app.use((err, req, res, next) => {
  logger.error(
    `${err.statusCode} ${req.method} ${req.originalUrl} ${err.message} - ${err.stack}`
  );
  next(err);
});

app.listen(port, () => {
  console.log('app is running on port ', port);
});

module.exports = { app };
