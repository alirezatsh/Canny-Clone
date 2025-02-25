require('dotenv').config()
const express = require('express')
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./src/swagger.json");
const errorHandler = require('./src/middlewares/errorhandlers');
const connectToDb = require('./src/config/db')
const postRoutes = require('./src/routes/v1/post-route')


const app = express()
const port = process.env.PORT || 3000;


app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(express.json())
app.use(errorHandler); 

connectToDb()

app.use('/api', postRoutes);




module.exports = {app}

app.listen(port , () =>{
    console.log('app is running on port ' , port) 
})