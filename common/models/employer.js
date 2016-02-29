var app = require('../../server/server');

module.exports = function(Employer) {

  Employer.observe('after save', function addUser(ctx, next) {
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        // Add UserModel
        var User = app.models.UserModel;
        var employer = ctx.instance;

        User.findOrCreate({
            where: {
              email: employer.contactEmail
            }
          }, // find
          {
            email: employer.contactEmail,
            password: 'password',
            userType: 'employer',
            employerId: employer.id
          }, // create
          function(err, createdUser, created) {
            if (err) {
              console.error('error creating employer user', err);
            }
          });
      }
    }


    next();
  });

};
