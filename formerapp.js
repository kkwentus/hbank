window.addEventListener('load', function() {
  var content = document.querySelector('.content');
  content.style.display = 'block';
  var isAuthenticated = new Boolean(false);

  /** 
  for logging into the website
  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    audience: 'https://' + AUTH0_DOMAIN + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email',
    leeway: 60
  });
  */

 var lockoptions = {
  theme: {
    logo: 'http://i67.tinypic.com/28mppw8.jpg',
    primaryColor: '#FF9C33'
  },
  languageDictionary: {
    title: "HipsterBank"
  }
};

 //using auth0 lock feature
 var lock = new Auth0Lock(
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  lockoptions
);

  var loginStatus = document.querySelector('.container h4');
  var loginView = document.getElementById('login-view');
  var homeView = document.getElementById('home-view');
  var profileView = document.getElementById('profile-view');

  var loginBtn = document.getElementById('userLoginBtn');
  var logoutBtn = document.getElementById('userLogoutBtn');
  var homeViewBtn = document.getElementById('homeBtn');
  var profileViewBtn = document.getElementById('profileBtn');


  homeViewBtn.addEventListener('click', function() {
    homeView.style.display = 'inline-block';
    profileView.style.display = 'none';
  });

  profileViewBtn.addEventListener('click', function() {
    homeView.style.display = 'none';
    profileView.style.display = 'inline-block';
    getProfile();
  });

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    lock.show();
  });

     // Listening for the authenticated event
     lock.on("authenticated", function(authResult) {
      // Use the token in authResult to getUserInfo() and save it to localStorage
      lock.getUserInfo(authResult.accessToken, function(error, profile) {
      if (error) {
         console.log('error in lock.on method');
         return;
      }

      localStorage.setItem('accessToken', authResult.accessToken);
      localStorage.setItem('profile', JSON.stringify(profile));
      isAuthenticated = true;
      console.log("Authentication event captured");
      });
   });

  logoutBtn.addEventListener('click', logout);


  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    lock.logout();
    displayButtons();
  }

  function displayButtons() {
    var loginStatus = document.querySelector('.container h4');
    console.log(isAuthenticated);
    if (isAuthenticated == true) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      profileViewBtn.style.display = 'inline-block';
      loginStatus.innerHTML =
        'You are logged in.';
    } else {
      homeView.style.display = 'inline-block';
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      profileViewBtn.style.display = 'none';
      profileView.style.display = 'none';
      loginStatus.innerHTML =
        'Please log in';
    }
  }//end displayButtons


 function getProfile() {
  lock.getUserInfo(localStorage.getItem('accessToken'), function(error, profile) {
    if (error) {
        alert("error getting profile, please contact your admin");
        console.log(error);
    }
    else {
      document.querySelector('#profile-view .nickname').innerHTML =
      profile.nickname;

      document.querySelector(
      '#profile-view .full-profile'
      ).innerHTML = JSON.stringify(userProfile, null, 2);
      document.querySelector('#profile-view img').src = profile.picture;
    }
  });
 }//end displayProfile

 displayButtons();
});