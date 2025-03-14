require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./src/swagger.json');
const PostRoutes = require('./src/routes/v1/post-route');
const AuthRoutes = require('./src/routes/v1/auth-route');
const logger = require('./logger');
const { basiclimit } = require('./src/middlewares/ratelimit-middleware');
const errorHandler = require('./src/middlewares/error-handler-middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// log for info level messages
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

// log for error level messages
app.use((err, req, res, next) => {
  logger.error(
    `${err.statusCode} ${req.method} ${req.originalUrl} ${err.message} - ${err.stack}`
  );
  next(err);
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(basiclimit(100, 60 * 15 * 1000));

app.use('/', PostRoutes, AuthRoutes); // main url
app.use(errorHandler);

module.exports = app;
