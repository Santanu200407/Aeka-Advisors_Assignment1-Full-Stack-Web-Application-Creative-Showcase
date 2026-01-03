const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const corsOptions = require('./config/cors');
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');
const userRoutes = require('./routes/users');

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
const db=mongoose.connection
db.on("error",()=>{
    console.log("Error while connecting to the mongo database")
})
db.once("open",()=>{
    console.log("Connected to mongodb")
})

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});