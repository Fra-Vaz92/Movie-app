const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const Models = require('./models.js');


const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director; 

const app = express();
const { check, validationResult } = require('express-validator');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


let allowedOrigins = ['http://localhost:8080', 'https://movie-app-47zy.onrender.com', 'http://localhost:1234', 'https://app-for-movie.netlify.app'];

//CORS
const cors = require('cors');
app.use(cors({
    origin: (origin, callback) => {
      console.log('Origin:', origin); // debug the origin
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'), false);
      }
    }
  }));


//Morgan Middleware function to log all requests
app.use(morgan('combined'));

//Passport Middleware function to authentication, must be after bodyParser
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


//GET request for a plain text answer
app.get('/', (req, res) => {
    res.send('Welcome to my Movie app!');
  });


//GET documentation file
app.use('/documentation',express.static('public'));


mongoose.connect( process.env.CONNECTION_URI, { 
    useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => handleError(error));



//READ/GET all movies route located to "/" as endpoint
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req,res) => {
  await Movies.find()
  .then((movies) => {res.json(movies);

  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:  ' + err);
  });
});


//READ/GET movies Title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
          if (movie) {
              res.json(movie);
          } else {
              res.status(404).send(
                  'Movie with the title ' +
                      req.params.Title +
                      ' was not found.'
              );
          }
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

//READ/GET all genre route located to "/" as endpoint
app.get('/genres', passport.authenticate('jwt', { session: false }), async (req,res) => {
  await Movies.find()
  .then((genre) => {res.json(genre);

  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error:  ' + err);
  });
});

//READ/GET movies by genre
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ 'Name': req.params.Name})
      .then((genre) => {
          if (genre) {
              res.json(genre);
          } else {
              res.status(404).send(
                  'Genre with the name ' + req.params.Name + ' was not found.'
              );
          }
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});


//READ/GET director's name
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ 'Director.Name': req.params.name })
      .then((director) => {
          if (director) {
              res.json(director.Director);
          } else {
              res.status(404).send(
                  'Director with the name ' +
                      req.params.name +
                      ' was not found.'
              );
          }
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

//DELETE movie from favoirte list
app.delete('/users/:Username/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate(
      {
          Username: req.params.Username,
          FavoriteMovies: req.params.movieId,
      },
      {
          $pull: { FavoriteMovies: req.params.movieId },
      },
      { new: true }
  )
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});


//CREATE new user
app.post('/users/register',
    [
        check('Username', 'Username is required').isLength({min:5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid.').isEmail(),
    ], 
    
    async (req, res) => {
let errors = validationResult(req);        
    if(!errors.isEmpty()) {
        return res.status(422).json({errors:errors.array()});
    }
let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Username: req.body.Username })
      .then((user) => {
          if (user) {
              return res
                  .status(400)
                  .send(req.body.Username + ' already exists;');
          } else {
              Users.create({
                  Username: req.body.Username,
                  Password: hashedPassword,
                  Email: req.body.Email,
                  Birthday: req.body.Birthday,
              })
                  .then((user) => {
                      res.status(201).json(user);
                  })
                  .catch((error) => {
                      console.error(error);
                      res.status(500).send('Error: ' + error);
                  });
          }
      })
      .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
      });
});
 
// READ/GET all users in the list
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.find()
      .then((users) => {
          res.json(users);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});


//READ/GET users by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async(req,res) => {
  await Users.findOne({Username: req.params.Username})
  .then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('user with the username' + req.params.Username + 'was not found.');
    }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });


//UPDATE username
app.put('/users/:Username',passport.authenticate('jwt', { session: false }), async (req, res) => {

     // CONDITION TO CHECK ADDED HERE
     if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
 await Users.findOneAndUpdate({Username:req.params.Username},
  {
    $set: {
      name: req.body.name,
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
    },

  },
  {new: true}
 )
 .then((updatedUser) => {
  res.json(updatedUser);
})
.catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
});
});

//CREATE favorite list
app.post('/users/:Username/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
          $push: { FavoriteMovies: req.params.movieId },
      },
      { new: true }
  )
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});


//DELETE Movie title from a list
app.delete('/users/:Username/movies/:movieTitle', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate(
      {
          Username: req.params.Username,
          FavoriteMovies: req.params.movieTitle,
      },
      {
          $pull: { FavoriteMovies: req.params.movieTitle },
      },
      { new: true }
  )
      .then((updatedUser) => {
          res.json(updatedUser);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});


//DELETE an existing user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
          if (!user) {
              res.status(400).send(req.params.Username + ' was not found.');
          } else {
              res.status(200).send(req.params.Username + ' was deleted.');
          }
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});


//Error handling function
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Something was broke!');
});

//function for the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port' + port);
});