const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 3000;
app.use(cors());

// Correct MongoDB connection string
// const mongoUri = 'mongodb+srv://rohan4404:Hapur@123@cluster0.cnvpvij.mongodb.net/Cluster0?retryWrites=true&w=majority';

// const mongoUri = "mongodb+srv://rohan4404:Hapur@123@cluster0.cnvpvij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const mongoUri = "mongodb+srv://rohansharma99anc:FCkDAmWBuW3bEwRT@cluster0.o594z.mongodb.net/dataset?retryWrites=true&w=majority&appName=Cluster0"

// FCkDAmWBuW3bEwRT

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
  airFlow: Number,
  timestamp: { type: Date, default: Date.now }
});

const Weather = mongoose.model('Weather', weatherSchema);

let Humidity = Math.random() * 30 + 50;
let temperature = Math.random() * 25 + 10;
let airFlow = Math.random() * 200 + 200;

function updateWeatherData() {
  Humidity = Math.random() * 30 + 50;
  temperature = Math.random() * 25 + 10;
  airFlow = Math.random() * 200 + 200;

  // Create a new weather data entry
  const newWeatherData = new Weather({
    Humidity: Humidity.toFixed(2),
    temperature: temperature.toFixed(2),
    airFlow: airFlow.toFixed(2)
  });

  // Save the weather data to MongoDB
  newWeatherData.save()
    .then(() => console.log('Weather data saved to MongoDB'))
    .catch((error) => console.error('Error saving weather data:', error));
}

// Update weather data and store it in MongoDB every 2 seconds
setInterval(updateWeatherData, 10000);

app.get('/weather', (req, res) => {
  res.json({
    Humidity: Humidity.toFixed(2),
    temperature: temperature.toFixed(2),
    airFlow: airFlow.toFixed(2)
  });
});

app.listen(port, () => {
  console.log(`Weather API listening at http://localhost:${port}`);
});
