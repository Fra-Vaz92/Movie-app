const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const uuid = require('uuid');

const app = express();

//Top 10 movies list

let movies = [

    {title: 'Harry Potter and the chamber of secrets',director:'J.K. Rowling'},
    {title: 'Lord of the Rings',director: 'J.R.R. Tolkien'},
    {title:'Lord of the Rings',director:'J.R.R Tolkien'},
    {title:'Star Wars: Return Of The Jedi', director:'George Lucas'},
    {title: 'The Dark Knight', director: 'Christopher Nolan'},
    {title: 'Forrest Gump', director: 'Robert Zemeckis'},
    {title: 'The Matrix', director: 'Lana Wachowski, Lilly Wachowski'},
    {title: 'The Godfather', director: 'Francis Ford Coppola'},
    {title: 'Pulp Fiction', director: 'Quentin Tarantino'},
    {title:'Schindler\'s List',director:'Steven Spielberg'},
];

//Morgan Middleware function to log all requests
app.use(morgan('combined'));

//GET route located to "/" as endpoint
app.get('/movies',(req,res) => {

    res.status(200).json(movies);

});

//GET request for a plain text answer
app.get('/', (req, res) => {
    res.send('Welcome to my Movie app!');
  });


//GET documentation file
app.use(express.static('public'));

//READ/GET movies name
app.get('/movies/:name', (req, res) => {
  res.send('Successful GET request returning data on a single movie.');
});

//READ/GET movies by genre
app.get('/genre/:name', (req, res) => {
  res.send('Successful GET request returning data on a genre.');
});

//READ/GET director's name
app.get('/directors/:name', (req, res) => {
  res.send('Successful GET request returning data on a director.');
});

//CREATE new user
app.post('/users/register', (req, res) => {
  res.send('Successful POST request to register a new user.');
});

//UPDATE username
app.put('/users/:username', (req, res) => {
  res.send('Successful PUT request to update a users username.');
});

//CREATE favorite list
app.post('/users/:username/favorites', (req, res) => {
  res.send('Successful POST request to add a movie to a users list of favorites.');
});

//DELETE Movie title from a list
app.delete('/users/:username/favorites/:movieTitle', (req, res) => {
  res.send('Successful DELETE request to remove a movie of a users list of favorites.');
});

//DELETE an existing user
app.delete('/users/:username', (req, res) => {
  res.send('Successful DELETE request to deregister an existing user.');
});


//Error handling function
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});

//function for the server
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });