const express = require('express')
const app = express()    //object app onle one on all project
const swaggerUi = require('swagger-ui-express');
const usersRoutes = require('./routes/users')
const cors=require('cors')
const swaggerDocument=require('./swagger.json')
// require('dotenv').config();
const dotenv = require('dotenv')
dotenv.config()
//conecct to DB
const mongoose = require('mongoose');
const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8fkcsmr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


mongoose.connect(DB_URI, {
  useNewUrlParser: true,        
  useUnifiedTopology: true     
})
.then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.error("Failed to connect to the database:", err);
  });
//middleware
app.use(cors({
    origin:'*' 

}))
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/users',usersRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Not Found middleware
app.use((req,res,next)=>{
    res.status(404).json({message:`${req.originalUrl} Not Found`})     
})
//Erorr Handling middleware
app.use(function(err,req,res,next){
    let statusCode=err.statusCode || 500;
    let message = err.message || 'Api Error'
  res.status(statusCode).json({message})
})
let port=3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})