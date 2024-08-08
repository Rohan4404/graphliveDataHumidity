const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from the "public" directory

const mongoUri = "mongodb+srv://rohansharma99anc:FCkDAmWBuW3bEwRT@cluster0.o594z.mongodb.net/dataset?retryWrites=true&w=majority&appName=Cluster0"

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

let Humidity = Math.random() * 30 + 50;
let temperature = Math.random() * 25 + 10;

// Function to save weather data to MongoDB
function saveWeatherData(temperature) {
  Humidity = Math.random() * 30 + 50;

  const newWeatherData = new Weather({
    Humidity: Humidity.toFixed(2),
    temperature: temperature.toFixed(2),
  });

  newWeatherData.save()
    .then(() => console.log('Weather data saved to MongoDB'))
    .catch((error) => console.error('Error saving weather data:', error));
}

// Route to handle form submission
app.post('/update-weather', (req, res) => {
  const { temperature } = req.body;
  if (!temperature) {
    return res.status(400).json({ error: 'Temperature is required' });
  }

  saveWeatherData(temperature);
  res.status(200).json({ message: 'Temperature updated successfully' });
});

app.get('/weather', (req, res) => {
  res.json({
    Humidity: Humidity.toFixed(2),
    temperature: temperature.toFixed(2),
  });
});

app.listen(port, () => {
  console.log(`Weather API listening at http://localhost:${port}`);
});
