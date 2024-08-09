const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// Allow the frontend hosted at `127.0.0.1` to make requests to the backend
const allowedOrigins = ['http://127.0.0.1:5500', 'https://graphlive-data-humidity-2a9hcjutu-rohan4404s-projects.vercel.app'];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Ensure you handle OPTIONS requests (preflight) separately if needed
app.options('*', cors(corsOptions));


app.use(express.json()); // To parse JSON bodies

// Define routes here...
 // To parse JSON bodies

// MongoDB connection string
const mongoUri = process.env.MONGO_URI || "mongodb+srv://rohansharma99anc:FCkDAmWBuW3bEwRT@cluster0.o594z.mongodb.net/dataset?retryWrites=true&w=majority&appName=Cluster0";

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
  const newWeatherData = new Weather({
    Humidity: humidity.toFixed(2),
    temperature: temperature.toFixed(2) 
  });

  newWeatherData.save()
    .then(() => console.log('Weather data saved to MongoDB'))
    .catch((error) => console.error('Error saving weather data:', error));
}

setInterval(updateWeatherData, 10000);

// Endpoint to set temperature from input
app.post('/set-temperature', (req, res) => {
  const { temp } = req.body;
  if (typeof temp === 'number') {
    temperature = temp;
    res.status(200).json({ message: 'Temperature updated successfully' });
  } else {
    res.status(400).json({ message: 'Invalid temperature value' });
  }
});

// Get the most recent weather data from the database
app.get('/weather', async (req, res) => {
  try {
    const latestWeather = await Weather.findOne().sort({ timestamp: -1 });
    if (latestWeather) {
      res.json({
        Humidity: latestWeather.Humidity.toFixed(2),
        temperature: latestWeather.temperature.toFixed(2)
      });
    } else {
      res.status(404).json({ message: 'No weather data found' });
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Weather API listening at http://localhost:${port}`);
});
