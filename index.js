const express = require('express');
const morgan = require('morgan');
const path = require('path');


const app = express();

//Top 10 movies list

let TopMovies = [

    {title: 'Harry Potter and the chamber of secrets',author:'J.K. Rowling'},
    {title: 'Lord of the Rings',author: 'J.R.R. Tolkien'},
    {title:'Lord of the Rings',author:'J.R.R Tolkien'},
    {title:'Star Wars: Return Of The Jedi', author:'George Lucas'},
    {title: 'The Dark Knight', director: 'Christopher Nolan'},
    {title: 'Forrest Gump', director: 'Robert Zemeckis'},
    {title: 'The Matrix', director: 'Lana Wachowski, Lilly Wachowski'},
    {title: 'The Godfather', director: 'Francis Ford Coppola'},
    {title: 'Pulp Fiction', director: 'Quentin Tarantino'},
    {title:'Schindler\'s List',author:'Steven Spielberg'},
];

//Morgan Middleware function to log all requests
app.use(morgan('combined'));

//GET route located to "/" as endpoint
app.get('/movies',(req,res) => {

    res.json(TopMovies);

});

//GET request for a plain text answer
app.get('/', (req, res) => {
    res.send('Welcome to my Movie app!');
  });


//GET documentation file
app.use(express.static('public'));

//Error handling function
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something broke!');
});

//function for the server
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
