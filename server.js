const http        = require('http')
const express = require("express");
const bodyParser  = require('body-parser')
const morgan      = require('morgan')
const cors        = require('cors')
const app         = module.exports = express()
const server      = http.createServer(app)
const port        = parseInt(process.env.PORT || 3000)
const devMode     = process.env.NODE_ENV !== 'production'


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan(devMode ? 'dev' : 'combined'))
app.use(cors({origin: true}))

var data = [{
  currentUser: 'N/A',
  profiles: ['Rex'],
  users: {
    Rex: {
      actors: ['Rob Schnider', 'George Clooney'],
      directors: ['Stanley Kubrick', 'Wes Anderson'],
      movies: ['The Departed']
    },
  }
}];
// var data1 = [{
//   users: ['Jay'],
//   actors: ['Testy McTest', 'Rob Schnider'],
//   directors: ['Stanley Kubrick', 'Dr. Testenstein']
// }];


app.post("/", function(request, response) {
  let user = request.body.data.user;
  let actor = request.body.data.actor;
  let movie = request.body.data.movie;
  let director = request.body.data.director;
  if (!data[0].users[user].actors.includes(actor) && actor !== '') {
    data[0].users[user].actors.push(actor)
  }
  if (!data[0].users[user].movies.includes(movie) && movie !== '') {
    data[0].users[user].movies.push(movie)
  }
  if (!data[0].users[user].directors.includes(director) && director !== '') {
    data[0].users[user].directors.push(director)
  }
})
app.post("/users/", function(request, response) {
  console.log(request.body);
    data[0].users[request.body.data.newUser] = {
      actors: [],
      directors: [],
      movies: []
    };
    if (!data[0].profiles.includes(request.body.data.newUser)) {
      data[0].profiles.push(request.body.data.newUser);
    }
})
app.post("/current/", function(request, response){
  console.log(request.body.data.selectedUser);
  data[0].currentUser = request.body.data.selectedUser;
});

app.post("/favorites/", function(request, response){
  let favorite = request.body.data.favorite;
  if (request.body.data.actor == 'on') {
    data[0].users[data[0].currentUser].actors.push(favorite);
  }
  if (request.body.data.director == 'on') {
    data[0].users[data[0].currentUser].directors.push(favorite);
  }
  if (request.body.data.movie == 'on') {
    data[0].users[data[0].currentUser].movies.push(favorite);
  }
});


app.get("/current/", function(request, response){
  console.log('hi');
});

app.get("/", function(request, response) {
  response.json(data)
})
app.get("/favorites/", function(request, response){
  response.json(data)
})

app.get("/users/", function(request, response) {
  let a = response.json(data);
  console.log(a.users);
})

app.use(notFound)
app.use(errorHandler)

server.listen(port)
  .on('error',     console.error.bind(console))
  .on('listening', console.log.bind(console, 'Listening on ' + port));

function notFound(req, res, next) {
  const url = req.originalUrl
  if (!/favicon\.ico$/.test(url) && !/robots\.txt$/.test(url)) {
    // Don't log less important auto requests
    console.error('[404: Requested file not found] ', url)
  }
  res.status(404).send({error: 'Url not found', status: 404, url})
}

function errorHandler(err, req, res, next) {
  console.error('ERROR', err)
  const stack =  devMode ? err.stack : undefined
  res.status(500).send({error: err.message, stack, url: req.originalUrl})
}
