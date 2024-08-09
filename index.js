const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 3000;

app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// Correct MongoDB connection string
const mongoUri = "mongodb+srv://rohansharma99anc:FCkDAmWBuW3bEwRT@cluster0.o594z.mongodb.net/dataset?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the weather schema and model
const weatherSchema = new mongoose.Schema({
  Humidity: Number,
  temperature: Number,
  timestamp: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', weatherSchema);

let humidity = Math.random() * 30 + 50; // Initial humidity
let temperature = 20; // Default initial temperature

function updateWeatherData() {
  // Create a new weather data entry with the current temperature
  const newWeatherData = new Weather({
    Humidity: humidity.toFixed(2),
    temperature: temperature.toFixed(2) // Use the latest temperature
  });

  // Save the weather data to MongoDB
  newWeatherData.save()
    .then(() => console.log('Weather data saved to MongoDB'))
    .catch((error) => console.error('Error saving weather data:', error));
}

// Update weather data and store it in MongoDB every 10 seconds
setInterval(updateWeatherData, 10000);

// Endpoint to set temperature from input
app.post('/set-temperature', (req, res) => {
  const { temp } = req.body; // Get temperature from the request body
  if (typeof temp === 'number') {
    temperature = temp; // Update the temperature variable
    res.status(200).json({ message: 'Temperature updated successfully' });
  } else {
    res.status(400).json({ message: 'Invalid temperature value' });
  }
});

// Get the most recent weather data from the database
app.get('/weather', async (req, res) => {
  try {
    const latestWeather = await Weather.findOne().sort({ timestamp: -1 }); // Get the most recent entry
    if (latestWeather) {
      res.json({
        Humidity: latestWeather.Humidity.toFixed(2),
        temperature: temperature.toFixed(2) // Use the temperature variable, not the one from the database
      });
    } else {
      res.status(404).json({ message: 'No weather data found' });
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Save initial weather data once when the server starts
updateWeatherData();

app.listen(port, () => {
  console.log(`Weather API listening at http://localhost:${port}`);
});
