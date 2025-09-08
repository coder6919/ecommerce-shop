require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- START OF THE FIX ---
// Updated CORS Configuration to include the Vite server's address.
const corsOptions = {
    // We now allow requests from the old Live Server and the new Vite server.
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5173'], 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// --- END OF THE FIX ---

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

