// myApp is a JavaScript variable that is sitting on the global scope and will contain the output of the containg
var api = (function($) {

  function apiFactory(authKey, apiUrl) {
    return function(entity) {
      var api = {
        authKey: authKey,
        name: entity,
        apiUrl: apiUrl,

        getAll: function(id) {
          return get(this.apiUrl + this.name);
        },
        get: function(id) {
          return get(this.apiUrl + this.name + "/" + id);
        },
        getChildren: function(id, childEntity) {
          return get(this.apiUrl + this.name + "/" + id + "/" + childEntity);
        },
        add: function(obj) {
          return post(this.apiUrl + this.name, obj);
        },
        update: function(obj) {
          return put(this.apiUrl + this.name, obj);
        }
      }
      return api;
    };
  }

  // The api object will be the output of this IFFE
  var api = {};
  api.assessor = {};
  api.employer = {};
  api.admin = {};
  // authKey is populated once a user has logged into the system and been provided an authorisation key.
  // This key is then used to make all other api calls.
  var authKey = "";
  var userType = "";
  var apiUrl = "http://localhost:3014/api/";

  function buildAPI() {
    var appAPI = {};
    var api = apiFactory(authKey, apiUrl);
    if (userType != "employer") {
      appAPI.assessor = api("Assessors");
    }
    appAPI.employer = api("Employers");
    appAPI.employee = api("Employees");
    appAPI.duty = api("Duties");
    appAPI.task = api("Tasks");
    appAPI.employeeTask = api("EmployeeTasks");
    appAPI.timing = api("Timings");

    return appAPI;
  }

  function success(data) {
    return {
      success: true,
      data: data
    }
  }

  function fail(err) {
    return {
      success: false,
      error: err
    }
  }

  /**********  Generic API Calls  ***********
   * API calls are managed by jQuery and wrapped in a Promise.
   * This promise is then returned to be handled by the calling function.
   *
   *  The promise will always return the response in the same structure.
   *     {
   *       success: true|false,
   *       data: {Response from the service},
   *       error: {Captured error object}
   *     }
   *
   *******************************************/

  function get(url) {
    return new Promise(function(resolve, reject) {
      $.get(url + "?access_token=" + authKey)
        .then(function(data) {
          resolve(success(data));
        })
        .fail(function(err) {
          reject(fail(err));
        });
    });
  }

  function post(url, data) {
    return new Promise(function(resolve, reject) {
      $.post(url + "?access_token=" + authKey, data)
        .then(function(data) {
          resolve(success(data));
        })
        .fail(function(err) {
          reject(fail(err));
        });
    });
  }

  function put(url, data) {
    return new Promise(function(resolve, reject) {
      $.ajax({
          url: url + "?access_token=" + authKey,
          method: "PUT",
          data: data,
          dataType: "json"
        })
        .then(function(data) {
          resolve({
            success: true,
            data: data
          });
        })
        .fail(function(err) {
          reject({
            success: false,
            error: err
          });
        });

    });
  }

  /**********  User  ***********/

  api.login = function(username, pwd) {
    // Return a new promise after get the authKey and setting for use internally in this module.
    return new Promise(function(resolve, reject) {
      post("http://localhost:3014/api/UserModels/login", {
          email: username,
          password: pwd
        }).then(function(response) {
          authKey = response.data.id;

          // get the user and return it
          get("http://localhost:3014/api/UserModels/" + response.data.userId)
            .then(function(response) {
              userType = response.data.userType;
              response.api = buildAPI();
              resolve(response);
            });
        })
        .catch(function(err) {
          reject(err);
        });
    });
  };
  api.register = function(username, pwd) {
    return post("http://localhost:3014/api/UserModels", {
      email: username,
      password: pwd
    });
  };
  api.signOut = function() {
    return post("http://localhost:3014/api/UserModels/logout");
  };

  return api;
}(jQuery));
