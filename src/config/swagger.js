const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const doc = {
  info: {
    title: 'Feedback Render',
    description: 'API documentation for a feedback website'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = path.join(__dirname, '../swagger.json');

const endpointsFiles = [path.join(__dirname, '../routes/v1/*.js')];

swaggerAutogen(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log('Swagger documentation has been generated!');
  })
  .catch((error) => {
    console.log('Error generating Swagger documentation:', error);
  });
