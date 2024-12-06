const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


const User = require('./models/userModel');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      
      let user = await User.findOne({email: email});
      if(user === null){
        return done(null, false, { message: 'No user with that email' })
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (e) {
        return done(e)
      }
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    try {
        done(null, await User.findById(id));
    } catch (err) {
        done(err, null);
    }
  });
};