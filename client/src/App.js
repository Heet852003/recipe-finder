import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Container, TextField, Button, Grid, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import flavourQuestLogo from './flavour_quest_logo.png';


// Ensure Montserrat font is applied
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#ffb74d',
    },
    background: {
      default: '#303030',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ffb74d',
    }
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',  // Ensure Montserrat is applied
  },
});

function App() {
  const [ingredient, setIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [mealPlan, setMealPlan] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const searchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/recipes?ingredient=${ingredient}`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
    setLoading(false);
  };

  const getRecipeDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      setSelectedRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    }
    setLoading(false);
  };

  const addToFavorites = (recipe) => {
    const newFavorites = [...favorites, recipe];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const removeFromFavorites = (recipe) => {
    const newFavorites = favorites.filter(fav => fav.idMeal !== recipe.idMeal);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const addToMealPlan = (day, recipe) => {
    setMealPlan({ ...mealPlan, [day]: recipe });
  };

  const removeFromMealPlan = (day) => {
    const newMealPlan = { ...mealPlan };
    delete newMealPlan[day];
    setMealPlan(newMealPlan);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Flavour Quest
            </Typography>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: 20 }}>Home</Link>
            <Link to="/favorites" style={{ textDecoration: 'none', color: 'inherit', marginRight: 20 }}>Favorites</Link>
            <Link to="/mealplan" style={{ textDecoration: 'none', color: 'inherit' }}>Meal Plan</Link>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Routes>
            <Route exact path="/" element={
              <>
                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <img 
        src={flavourQuestLogo} 
        alt="Flavour Quest Logo" 
        style={{ width: '250px', height: '250px', marginRight: '5px' }} 
      />
                <Typography variant="h2" component="h1" gutterBottom>
                  Flavour Quest
                </Typography>
                </div>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Enter an ingredient"
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  sx={{ mb: 2, input: { color: 'black' }, label: { color: 'black' }, '.MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } } }}
                  InputLabelProps={{ style: { color: 'black' } }}
                  InputProps={{ style: { color: 'black' } }}
                />
                <Button variant="contained" color="secondary" onClick={searchRecipes} sx={{ mb: 2 }}>
                  Search Recipes
                </Button>

                {loading && <CircularProgress />}

                <Grid container spacing={3}>
                  {recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe.idMeal} style={{ display: 'flex' }}>
                      <Card sx={{ backgroundColor: theme.palette.primary.dark, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                          <Typography variant="h6">{recipe.strMeal}</Typography>
                          <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ width: '100%', borderRadius: '8px' }} />
                          <Button onClick={() => getRecipeDetails(recipe.idMeal)} color="secondary" sx={{ mt: 2 }}>
                            View Details
                          </Button>
                          <Button onClick={() => addToFavorites(recipe)} color="secondary" sx={{ mt: 2 }}>
                            Add to Favorites
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {selectedRecipe && (
                  <div style={{ marginTop: '40px' }}>
                    <Typography variant="h4">{selectedRecipe.strMeal}</Typography>
                    <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} style={{ width: '100%', borderRadius: '8px' }} />
                    <Typography variant="h6" sx={{ mt: 2 }}>Ingredients:</Typography>
                    <ul>
                      {Array.from({ length: 20 }, (_, i) => i + 1)
                        .filter(i => selectedRecipe[`strIngredient${i}`])
                        .map(i => (
                          <li key={i}>
                            {selectedRecipe[`strIngredient${i}`]} - {selectedRecipe[`strMeasure${i}`]}
                          </li>
                        ))}
                    </ul>
                    <Typography variant="h6" sx={{ mt: 2 }}>Instructions:</Typography>
                    <Typography>{selectedRecipe.strInstructions}</Typography>
                  </div>
                )}
              </>
            } />
            <Route path="/favorites" element={
              <>
                <Typography variant="h4" sx={{ mt: 4 }}>Favorites</Typography>
                <Grid container spacing={3}>
                  {favorites.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} key={recipe.idMeal} style={{ display: 'flex' }}>
                      <Card sx={{ backgroundColor: theme.palette.primary.dark, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <CardContent>
                          <Typography variant="h6">{recipe.strMeal}</Typography>
                          <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ width: '100%', borderRadius: '8px' }} />
                          <IconButton color="secondary" onClick={() => removeFromFavorites(recipe)} sx={{ mt: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            } />
            <Route path="/mealplan" element={
              <>
                <Typography variant="h4" sx={{ mt: 4 }}>Meal Plan</Typography>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="meal plan table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>Recipe</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <TableRow key={day}>
                          <TableCell component="th" scope="row">{day}</TableCell>
                          <TableCell>
                            {mealPlan[day] ? (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography>{mealPlan[day].strMeal}</Typography>
                                <img src={mealPlan[day].strMealThumb} alt={mealPlan[day].strMeal} style={{ width: '100px', borderRadius: '8px', marginLeft: '10px' }} />
                              </div>
                            ) : (
                              <Button onClick={() => addToMealPlan(day, recipes[0])} color="secondary">
                                Add Recipe
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            {mealPlan[day] && (
                              <IconButton color="secondary" onClick={() => removeFromMealPlan(day)}>
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            } />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
