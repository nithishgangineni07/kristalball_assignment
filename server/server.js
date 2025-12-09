require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mams', {
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Register Models
require('./models/User');
require('./models/Base');
require('./models/Asset');
require('./models/Purchase');
require('./models/Transfer');
require('./models/Assignment');
require('./models/Expenditure');
require('./models/AuditLog');


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/transfers', require('./routes/transfers'));
app.use('/api/assignments', require('./routes/assignments'));
// app.use('/api/audit', require('./routes/audit')); // If needed

app.get('/', (req, res) => {
  res.send('MAMS API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
