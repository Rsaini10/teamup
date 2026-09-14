require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const listingRoutes = require('./routes/listings');

const app = express();
app.use(cors({
    origin:"http://localhost:5173"
}));
app.use(express.json());

app.use('/api/listings', listingRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));