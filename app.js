'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const port =  process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware to parse JSON requests
app.use(express.json());

// routes
app.use('/', require('./routes/profile')());

/// MongoDB server instance
let mongoServer;

// Start the in-memory database
const startDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connected to in-memory MongoDB');
};

// Start the Express server
const startServer = () => {
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  
    // Gracefully stop the in-memory database when the application exits
    process.on('SIGINT', async () => {
      await mongoose.disconnect();
      await server.close();
      console.log('Stopped server and disconnected from in-memory MongoDB');
    });
  };

  // Start the in-memory database and then start the Express server
startDatabase().then(startServer);
