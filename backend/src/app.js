// This file sets up the Express application ( “Create the backend app” ).
// Creates Express app , sets up middleware and Connects routes.

const express = require('express');
const connectDB = require('./config/db');
const emergencyRoutes = require('./routes/emergencyRoutes');
const ambulanceRoutes = require('./routes/ambulanceRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');


const app = express();
app.use(express.json());

connectDB();

app.use('/api/emergencies', emergencyRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/hospitals', hospitalRoutes);

app.get('/', (req, res) => {
    res.send('Server is running');
});

module.exports = app;
