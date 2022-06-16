const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const user = require('../model/user');

passport.serializeUser(function(user, done){
    done(null, user.id);
})

passport.deserializeUser(function(id, done){
    user.findOne({_id: id}, function(err, user){
        done(err, user);
    })
})

passport.use('local-login',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done){
        user.findOne({email: email})
            .then(function(result){
                if(!result) return done(null, false);
                else{
                    //console.log(result.email, result.password)
                    if (password === result.password) {
                        return done(null, result);
                    } else {
                        return done(null, false, {message: 'incorrect'});
                    }
                }

                /*
                bcrypt.compare(password, user.password, function(err, result){
                    if(result){
                        return done(null, user);
                    }else{
                        console.log("password incorrect");
                        return done(null, false, {message: 'incorrect'});
                    }
                });
                 */
            })
    })
)

module.exports = passport;