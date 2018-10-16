# hipsterbank

Example use of Auth0 functionality. 

Reuse of code from tutorial samples in: https://github.com/auth0-samples/auth0-javascript-samples

1. Uses Lock to autheticate SSO into an app from either Google social or user/pass in DB (assuming no whiteList rule has been enabled)

2. Allows any authenticated user to see their Auth0 profile data.

3. Allows any authenticated user with the Authorization role *create:customers* to see the 'Create' button in the UI
  * Server-side the POST API checks for same access token role to be present.

4. Allows any authenticated user with the authorization role of *delete:customers* to see the 'Delete' button in the UI
  * Server-side the DELETE API checks for the same access token role to be present.
