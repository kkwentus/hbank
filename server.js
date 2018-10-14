//setup the express webserver
const express = require('express');
const port = process.env.PORT || 3000;
const bparser = require('body-parser');

var app = express();
var path = require('path');
var jwt = require('express-jwt');
var jwksRsa = require('jwks-rsa');

//expresss
app.use(express.static(__dirname));
app.use(bparser.json());

/**  
//https://auth0.com/docs/quickstart/backend/nodejs/01-authorization
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://kkwen.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: '5b988187a866001cad863ab7',
    issuer: AUTHO_DOMAIN,
    algorithms: ['RS256']
  });
*/


//endpoints

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/index.html'));
});

//start the webserver
app.listen(port, ()=> {
    console.log(`HipsterBank is running on port ${port}`);
});