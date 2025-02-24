const swaggerAutogen = require('swagger-autogen')(); 
const path = require('path');

const doc = {
  info: {
    title: 'Feedback Render',
    description: 'API documentation for a feedback website',
  },
  host: 'localhost:3000', 
  schemes: ['http'],
};

const outputFile = path.join(__dirname, '../swagger.json');

const endpointsFiles = [path.join(__dirname, '../../main.js')];

swaggerAutogen(outputFile, endpointsFiles)
  .then(() => {
    console.log('Swagger documentation has been generated!');
  })
  .catch((error) => {
    console.log('Error generating Swagger documentation:', error);
  });
