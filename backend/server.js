const express = require('express')
const env= require('dotenv/config')
const app = express();
const db = require('./config/db')
const cors = require('cors')
const profileRoute = require('./routes/profileRoute')


// Middleware 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form submissions
app.use("/uploads", express.static("uploads"));



// Route Middleware 

app.use("/api/profile", profileRoute);



app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(process.env.PORT,()=>console.log('Server Connected',process.env.PORT))

