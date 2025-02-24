require('dotenv').config()
const express = require('express')
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./src/swagger.json");

const app = express()
const port = process.env.PORT || 3000;


app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));



app.use(express.json())


app.listen(port , () =>{
    console.log('app is running on port ' , port) 
})