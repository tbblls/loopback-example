var app = require('../../server/server');

module.exports = function(Assessor) {
  Assessor.observe('after save', function addUser(ctx, next) {
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        // Add UserModel
        var User = app.models.UserModel;
        var assessor = ctx.instance;

        User.findOrCreate({
            where: {
              email: assessor.email
            }
          }, // find
          {
            email: assessor.email,
            password: 'password',
            userType: 'assessor',
            assessorId: assessor.id
          }, // create
          function(err, createdUser, created) {
            if (err) {
              console.error('error creating assessor user', err);
            }



          });
      }
    }


    next();
  });
};
