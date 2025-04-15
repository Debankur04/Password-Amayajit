const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const CredentialsRoutes = require('./routes/credential.routes')

// Init
dotenv.config();
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/credentials', CredentialsRoutes)



app.use('/',(req,res)=>{
    res.send('Hello World')
})

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
