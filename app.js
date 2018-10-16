window.addEventListener('load', function() {
  var userProfile;
  var content = document.querySelector('.content');
  content.style.display = 'block';
  var isAuthenticated = new Boolean(false);

  var hipsterURL = AUTH0_API_URL;
  
//////////////////////////////////// 
/// LOCK UI for login
  var lockoptions = {
    theme: {
      logo: 'http://i67.tinypic.com/28mppw8.jpg',
      primaryColor: '#FF9C33'
    },
    languageDictionary: {
      title: "HipsterBank"
    },
    auth:{
      params:{
        scope: 'openid profile email',         
        audience: AUTH0_AUDIENCE
      }
    }
  };

   //using auth0 lock feature
   var lock = new Auth0Lock(
    AUTH0_CLIENT_ID,
    AUTH0_DOMAIN,
    lockoptions
  );

  lock.on('authorization_error', function(error) {
    lock.show({
      flashMessage: {
        type: 'error',
        text: error.errorDescription
      }
    });
  });//end

  lock.on("authenticated", function(authResult) {
    // Call getUserInfo using the token from authResult
    console.log("LOCK authentication registered");

    lock.getUserInfo(authResult.accessToken, function(error, profile) {
      if (error) {
        console.log(error);
        return;
      }
        console.log(JSON.stringify(authResult, undefined, 2));    
        
      localStorage.setItem('accessToken', authResult.accessToken);
         // console.log("Access Token::")
         // console.log(authResult.accessToken);

      userProfile = profile;
        //console.log("User Profile::")
        //console.log(JSON.stringify(profile, undefined, 2));
        
      localStorage.setItem('scopes', JSON.stringify(authResult.scope, undefined, 2));
        //console.log("Scopes::");
        //console.log(JSON.stringify(authResult.scope, undefined, 2));

      isAuthenticated = true;
      
      displayButtons();
    });
});//end authenticated on
////////////////////////////////

  var loginStatus = document.querySelector('.container h4');
  var loginView = document.getElementById('login-view');
  var homeView = document.getElementById('home-view');
  var profileView = document.getElementById('profile-view');
  var apiView = document.getElementById('api-view');

  var loginBtn = document.getElementById('userLoginBtn');
  var logoutBtn = document.getElementById('userLogoutBtn');
  var homeViewBtn = document.getElementById('homeBtn');
  var profileViewBtn = document.getElementById('profileBtn');

  var apiCreateBtn = document.getElementById('apiCreateBtn');
  var apiDeleteBtn = document.getElementById('apiDeleteBtn');
  var apiMessage = document.getElementById('apiMessage');


////  Login, Logout, Profile buttons

  homeViewBtn.addEventListener('click', function() {
    homeView.style.display = 'inline-block';
    profileView.style.display = 'none';
  });

  profileViewBtn.addEventListener('click', function() {
    homeView.style.display = 'none';
    profileView.style.display = 'inline-block';
    displayProfile();
  });

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    lock.show();
  });

  logoutBtn.addEventListener('click', logout);

  /////////////////////////////////////////////////

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('scopes');
    localStorage.removeItem('profile');

    isAuthenticated = false;
    lock.logout();
    displayButtons();
  }//end logout


  function displayButtons() {
    var loginStatus = document.querySelector('.container h4');

    //buttons shown when user is logged in
    if (isAuthenticated == true) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      profileViewBtn.style.display = 'inline-block';
      loginStatus.innerHTML =
        ' ';
      //should we show management buttons?
      if (userHasScopes(['create:customers']) && userHasScopes(['delete:customers']) ) {
          apiCreateBtn.style.display = 'inline-block';
          apiDeleteBtn.style.display = 'inline-block';
          apiView.style.display = 'inline-block';
      }
      else if(userHasScopes(['create:customers'])){
          apiCreateBtn.style.display = 'inline-block';
          apiDeleteBtn.style.display = 'none';
          apiView.style.display = 'inline-block';
      }
      else {
          apiCreateBtn.style.display = 'none';
          apiDeleteBtn.style.display = 'none';
          apiView.style.display = 'none';
      }
    //buttons shown for users not logged in    
    } else {
      homeView.style.display = 'inline-block';
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      profileViewBtn.style.display = 'none';
      profileView.style.display = 'none';
      apiCreateBtn.style.display = 'none';
      apiDeleteBtn.style.display = 'none';
      apiView.style.display = 'none';
      loginStatus.innerHTML =
        'Please Log in';
    }
  }//end displayButtons


  function displayProfile() {
    document.querySelector('#profile-view .nickname').innerHTML =
      userProfile.nickname;
    document.querySelector(
      '#profile-view .full-profile'
    ).innerHTML = JSON.stringify(userProfile, null, 2);
    document.querySelector('#profile-view img').src = userProfile.picture;
  }//end displayProfile

   //API calls, server side authenticated against permissions 
  apiCreateBtn.addEventListener('click', function() {
    callAPI('/customers', true, 'POST', function(err, response) {
      if (err) {
        alert(err);
        return;
      }
  
      document.querySelector('#apiMessage').innerHTML = response;
    });
  });//end
  
  apiDeleteBtn.addEventListener('click', function() {
    callAPI('/customers', true, 'DELETE', function(err, response) {
      if (err) {
        alert(err);
        return;
      }
  
      document.querySelector('#apiMessage').innerHTML = response;
    });
  });//end

 
  //UI buttons - does the token of this user have an appropriate scope?
  function userHasScopes(scopes) {
    var savedScopes = JSON.parse(localStorage.getItem('scopes'));
    if (!savedScopes) {
      return false;
    }

    var grantedScopes = savedScopes.split(' ');

    for (var i = 0; i < scopes.length; i++) {
      if (grantedScopes.indexOf(scopes[i]) < 0) {
        return false;
      }
    }
  
    return true;
  }
 
  //API calls, server side authenticated against permissions 
  apiCreateBtn.addEventListener('click', function() {
    callAPI('/customers', true, 'POST', function(err, response) {
      if (err) {
        alert(err);
        return;
      }
  
      document.querySelector('#apiMessage').innerHTML = response;
    });
  });
  
  apiDeleteBtn.addEventListener('click', function() {
    callAPI('/customers', true, 'DELETE', function(err, response) {
      if (err) {
        alert(err);
        return;
      }
  
      document.querySelector('#apiMessage').innerHTML = response;
    });
  });


 //call API with the token received from Lock
  function callAPI(endpoint, secured, method, cb) {
    var url = hipsterURL + endpoint;
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    if (secured) {
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + localStorage.getItem('accessToken')
      );
    }
    xhr.onload = function() {
      if (xhr.status == 200) {
        var message = JSON.parse(xhr.responseText).message;
        cb(null, message);
      } else {
        cb(xhr.statusText);
      }
    };
    xhr.send();
  }//end callAPI

  //show login screen
  displayButtons();

});//end app.js
