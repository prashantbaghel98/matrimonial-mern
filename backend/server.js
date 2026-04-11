const express = require('express')
const env= require('dotenv/config')
const app = express();
const db = require('./config/db')
const cors = require('cors')
const profileRoute = require('./routes/profileRoute')
const userRoute = require('./routes/userRoute')
const cookieParser = require('cookie-parser');
const path = require("path");
const { siteMap } = require('./controllers/siteMap');


// Middleware 

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form submissions
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "dist")));



// Route Middleware 

app.use("/api/profile", profileRoute);
app.use("/api/user",userRoute);


// Site Map 
app.get("/sitemap.xml", siteMap);




// 🔥 fallback (VERY IMPORTANT)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(process.env.PORT,()=>console.log('Server Connected',process.env.PORT))

