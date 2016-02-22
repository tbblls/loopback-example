// myApp is a JavaScript variable that is sitting on the global scope and will contain the output of the containg
var myAppApi = (function($) {
  // The api object will be the output of this IFFE
  var api = {};
  // authKey is populated once a user has logged into the system and been provided an authorisation key.
  // This key is then used to make all other api calls.
  var authKey = "";

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

  function post(url, data) {
    return new Promise(function(resolve, reject) {
      $.post(url + "?access_token=" + authKey, data)
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
      post("http://localhost:3014/api/Users/login", {
          email: username,
          password: pwd
        }).then(function(response) {
          authKey = response.data.id;
          resolve(response);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  };

  api.register = function(username, pwd) {
    return post("http://localhost:3014/api/Users", {
      email: username,
      password: pwd
    });
  };

  api.signOut = function() {
    return post("http://localhost:3014/api/Users/logout");
  };

  /**********  Assessor  ***********/
  // gets all Assessors
  api.getAssessors = function() {
    return get("http://localhost:3014/api/Assessors");
  };
  // gets an Assessor by Id
  api.getAssessor = function(id) {
    return get("http://localhost:3014/api/Assessors/" + id);
  };
  // adds an Assessor
  api.addAssessor = function(assessor) {
    return post("http://localhost:3014/api/Assessors", assessor);
  };
  // updates an Assessor
  api.updateAssessor = function(id, assessor) {
    return put("http://localhost:3014/api/Assessors/" + id, assessor);
  };

  /**********  Employers  ***********/
  // gets all Employers for Assessor
  api.getAssessorEmployers = function(id) {
    return get("http://localhost:3014/api/Assessors/" + id + "/employers");
  };

  // adds an Employer
  api.addEmployer = function(employer) {
    return post("http://localhost:3014/api/Employers", employer);
  };

  // updates an Employer
  api.updateEmployer = function(id, employer) {
    return put("http://localhost:3014/api/Employers/" + id, employer);
  };

  return api;
}(jQuery));
