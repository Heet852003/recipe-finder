const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const BASE_URL = process.env.THEMEALDB_BASE_URL || 'https://www.themealdb.com/api/json/v1/1';

// API routes
app.get('/api/recipes', async (req, res) => {
  try {
    const { ingredient } = req.query;
    const response = await axios.get(`${BASE_URL}/filter.php?i=${ingredient}`);
    res.json(response.data.meals || []);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching recipes' });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
    res.json(response.data.meals[0]);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching recipe details' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch all other routes and return the index.html file from the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
