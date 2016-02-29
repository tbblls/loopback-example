var app = require('../../server/server');

module.exports = function(UserModel) {
  // Set the username to the users email address by default.
  UserModel.observe('after save', function setDefaults(ctx, next) {

    console.log('setDefaults', ctx.instance.email);
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        ctx.instance.username = ctx.instance.email;

        var userType = ctx.instance.userType;
        var Role = app.models.Role;
        var RoleMapping = app.models.RoleMapping;

        if (userType === 'assessor' || userType === 'employer') {
          // get the Role and then add the current user
          Role.findOne({
              where: {
                name: userType
              }
            }, // find
            function(err, role) {
              console.log("Role is ", userType, role )
              if (err) {
                console.error('Error searching for Role', err);
              }
              role.principals.create({
                principalType: RoleMapping.USER,
                principalId: ctx.instance.id //user id
              }, function(err, rolePrincipal) {
                if (err) {
                  console.error('error creating rolePrincipal', err);
                }

              });
            });

        }
      }
    }

    next();
  });

};
