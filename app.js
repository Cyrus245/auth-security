require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/users');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const e = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook');
const findOrCreate = require('mongoose-findorcreate');

const app = express();



app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}))


app.use(session({

    secret: "Love the way you lie.",
    resave: false,
    saveUninitialized: false



}))

app.use(passport.initialize());
app.use(passport.session())

mongoose.connect("mongodb://localhost:27017/subscriberDB");


app.get('/', (req, res) => {

    res.render('home')

})

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile']
    }));


app.get('/auth/google/secrets',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect to secrets.
        res.redirect('/secrets');
    });


app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect secrets.
        res.redirect('/secrets');
    });


app.get('/login', (req, res) => {

    res.render('login')

})

app.get('/register', (req, res) => {

    res.render('register')

})

app.get('/secrets', (req, res) => {

    User.find({
        secret: {
            $ne: null
        }
    }, function (err, foundUsers) {
        if (err) {
            console.log(err);
        } else {
            if (foundUsers) {
                res.render("secrets", {
                    usersWithSecrets: foundUsers
                });
            }
        }
    });
})


app.get('/logout', function (req, res) {


    req.logout((err) => {

        err ? console.log(err) : res.redirect('/')

    })

})


app.get('/submit', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }



})


app.post('/submit', (req, res) => {

    const submittedSecret = req.body.secret;

    //console.log(req.user);

    // User.findById(req.user.id, (err, foundUser) => {

    //     if (err) {

    //         console.log(err)
    //     } else {

    //         if (foundUser) {

    //             foundUser.secret = submittedSecret;
    //             foundUser.save(() => {

    //                 res.redirect('/secrets')
    //             })
    //         }

    //     }
    // })

    User.findById(req.user.id).then(foundUser => {

            foundUser.secret = submittedSecret;
            foundUser.save(() => {

                res.redirect('/secrets')
            })

        })
        .catch(err => {

            console.log(err)
        })



})



app.post('/register', (req, res) => {

    User.register({
        username: req.body.username
    }, req.body.password, (err, user) => {


        if (err) {

            console.log(err);
            res.redirect("/register")
        } else {



            passport.authenticate("local")(req, res, () => {

                res.redirect("/secrets");


            })
        }


    })




})


app.post('/login', (req, res) => {

    const user = new User({

        username: req.body.username,
        password: req.body.password


    })

    req.login(user, (err) => {

        if (err) {

            console.log(err);
        } else {

            passport.authenticate("local")(req, res, () => {

                res.redirect("/secrets");


            })

        }

    })





})


app.get('/logout', (req, res) => {


    res.redirect('home')
})


app.listen(3000, () => {

    console.log(`server started on port 3000`)

})