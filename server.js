const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

var data = [{
  actors: ['Testy McTest', 'Rob Schnider'],
  directors: ['Stanley Kubrick', 'Dr. Testenstein']
}];

app.get("/", function(request, response) {
  response.json({data});
})
