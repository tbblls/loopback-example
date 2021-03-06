(function(myAppApi){
// Pass in app api module for use in application

  var assessmentApp = (function($, app){
    // This module simplifies the implementation of the application

    var appApi = {};
    // This object will be exposed by the module
    var api = {
      assessors: {},
      employers: {},
      ui: {}
    };

    // call the myAppApi to get all Assessors and then initialises the screen
    function showAssessors(){
      appApi.assessor.getAll()
        .then(initAssessors);
    }

    // call the myAppApi to get all employers for an assessor and then initialises the screen
    function showEmployers(assessor){
      appApi.assessor.getChildren(assessor.id, "employers")
      .then(function(response){
        setAssessorEmployers(assessor, response);
      });
    }

    // Adds employers details to screen
    function setAssessorEmployers(assessor, response){
      $("#assessorsDisplayName").text(assessor.name);
      $("#employersMesssage").text("There are currently " + response.data.length + " employers");
      populateList($("#employersList"), response.data, "name", "id","employer");
      $(".assessor").show();
    }

    // Adds assessors details to screen
    function initAssessors(response){
      $("#assessorsMesssage").text("There are currently " + response.data.length + " assessors");
      populateList($("#assessorsList"), response.data, "name", "id","assessor");
      $(".assessorLink").on('click', assessorClick);
      $("#assessorName").val("");
      $(".assessor").hide();
    }

    // Initailises signIn details on the screen
    function signInInit(username){
      api.ui.toggleSignIn(true);
      $("#username").val(username);
      $("#password").val('');
    }

    // click event for assessors list items
    function assessorClick(e){
      var assessorId = $(this).attr('data-assessorId');
      $(".assessorLink").removeClass('active');
      $(this).addClass('active');
      var assessor = {
        id: assessorId,
        name: $(this).text()
      };
      showEmployers(assessor);
    }

    // populates list based on array of data. Uses Bootstrap styling
    function populateList($list, data, titleProp, idProp, entity) {
      $list.empty();
      if (data.length > 0) {
        data.map(function(item) {
          $list.append("<a id='"+entity+item[idProp]+"' class='list-group-item "+entity+"Link' href='#' data-"+entity+"Id='"+ item[idProp] +"'>" + item[titleProp] + "</a>")
        });
      }
    }

    // Attempts to sign user in
    api.signIn = function(e){
      e.preventDefault();

      app.login($("#username").val(), $("#password").val())
        .then(function(data) {
          appApi = data.api;
          $(".signIn").hide();
          $(".signedIn").show();
          showAssessors();
        })
        .catch(function(err) {
          console.log(err);
        });
    };

    // Attempts to register user
    api.register = function(){
        var username = $("#regUsername").val().trim(),
            pwd = $("#regPassword").val().trim();

        app.register(username, pwd)
          .then(function() {
            signInInit(username);
          })
          .catch(function(err) {
            console.log(err);
          });
    };

    // Signs out signed in user
    api.signOut = function(){
      app.signOut()
        .then(function() {
          $(".signIn").show();
          $(".signedIn").hide();
        });
    };

    // Adds a new Assessor
    api.assessors.add = function(){
      appApi.assessor.add({
          name: $("#assessorName").val()
        })
      .then(showAssessors);
    };

    // Adds a new Employer
    api.employers.add = function(){
      var assessorId = $(".assessorLink.active").attr('data-assessorId');
      appApi.addEmployer({
        name: $("#employerName").val(),
        "assessorId": assessorId
      })
      .then(function(){
        showEmployers({
          id: assessorId,
          name: $("#assessorsDisplayName").text()
        });
        $("#employerName").val("");
      });
    };

    // Toggles SignIn and Registration screens
    api.ui.toggleSignIn = function(show){
      $(".signIn").toggle(show);
      $(".register").toggle(!show);
    };

    return api;
  }(jQuery, api));



  $("#register").on('click', assessmentApp.register);
  $("#signIn").on('click', assessmentApp.signIn);
  $("#signOut").on("click", assessmentApp.signOut);

  $("#addAssessor").on("click", assessmentApp.assessors.add);
  $("#addEmployer").on('click', assessmentApp.employers.add);

  $("#showSignIn").on('click', function() {
    assessmentApp.ui.toggleSignIn(true);
  });

  $("#showReg").on('click', function() {
    assessmentApp.ui.toggleSignIn(false);
  });




}())
