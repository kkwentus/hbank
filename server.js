//setup the express webserver
const express = require('express');
const port = process.env.PORT || 3000;

const bodyparser = require('body-parser');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');
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
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
  }));
app.use(cors());


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
    audience: 'HIPSTERBANKURL', 
    issuer: 'https://kkwen.auth0.com',
    algorithms: [ 'RS256' ]
  });


//endpoints

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

//stub out create and delete API calls
app.post('/customers', checkJwt, jwtAuthz(['create:customers']), function(request, response) {
    response.json({ message: "A new customer has been created" });
});


app.delete('/customers', checkJwt, jwtAuthz(['delete:customers']), function(request, response) {
    response.json({ message: "A customer has been deleted" });
});


/** app.post('/customers', checkJwt, function(request, response) {
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
**/

//start the webserver
app.listen(port, ()=> {
    console.log(`HipsterBank is running on port ${port}`);
});