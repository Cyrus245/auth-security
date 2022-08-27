require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/users');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const e = require('express');


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

app.get('/login', (req, res) => {

    res.render('login')

})

app.get('/register', (req, res) => {

    res.render('register')

})

app.get('/secrets', (req, res) => {

    if (req.isAuthenticated()) {

        res.render('secrets')
    } else {

        res.redirect('/login')
    }
})


app.get('/logout', function (req, res) {


    req.logout((err) => {

        err ? console.log(err) : res.redirect('/')

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