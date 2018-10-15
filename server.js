//setup the express webserver
const express = require('express');
const port = process.env.PORT || 3000;

const bparser = require('body-parser');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');

var app = express();
var path = require('path');
//var request = require("request");

//setup database & customer 
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//use the URL set by mongodb in heroku, else use local
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hipster');

var {Customer} = require('./customer');
const {ObjectId} = require('mongodb');

//setup middleware
app.use(express.static(__dirname));
app.use(bparser.json());
app.use(bparser.urlencoded({
    extended: true
  }));
app.use(cors());


/** 
var options = { method: 'POST',
  url: 'https://kkwen.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"vEk1MVJASZN3ljLmyVq87sE7FKNPXuId","client_secret":"gReoeH-nCCy7MXGMbXLqAvmXWraAwfZ1OhrDBxGYuHkCglP1XsrHzTen4n0s6Oh4","audience":"urn:auth0-authz-api","grant_type":"client_credentials"}' 
};

request(options, function (error, response, body) {
  if (error){
    throw new Error(error);
  }
  console.log(body);
});
*/
// Create middleware for checking the JWT
const checkJwt = jwt({
    // Dynamically provide a signing key based on the kid in the header 
    //and the singing keys provided by the JWKS endpoint
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://kkwen.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer
    audience: 'urn:auth0-authz-api', 
    issuer: 'https://kkwen.auth0.com',
    algorithms: [ 'RS256' ]
  });


//endpoints

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/customers', function(request, response) {
    console.log('add customer record requested', request.body);

    var cust = new Customer({
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        zipcode: request.body.zipcode
    });

    cust.save().then((doc) =>{
        console.log('created new customer');
        response.status(200).send;
        response.send(doc);

    }, (error) =>{
        response.status(400).send(error);
        console.log('unable to create new customer');
    });  
});


//start the webserver
app.listen(port, ()=> {
    console.log(`HipsterBank is running on port ${port}`);
});