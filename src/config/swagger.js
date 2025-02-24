const swaggerAutogen = require('swagger-autogen')(); // Import swagger-autogen
const path = require('path');

const doc = {
  info: {
    title: 'Feedback Render',
    description: 'API documentation for a feedback website',
  },
  host: 'localhost:3000',  // یا آدرس مورد نظر شما
  schemes: ['http'],
};

// مسیر فایل خروجی (swagger.json)
const outputFile = path.join(__dirname, '../swagger.json');

// مسیر فایل‌های Endpoints که می‌خواهیم مستندات اون‌ها رو بسازیم
const endpointsFiles = [path.join(__dirname, '../../main.js')];

// تولید داکیومنت Swagger
swaggerAutogen(outputFile, endpointsFiles)
  .then(() => {
    console.log('Swagger documentation has been generated!');
  })
  .catch((error) => {
    console.log('Error generating Swagger documentation:', error);
  });
