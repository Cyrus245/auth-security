require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/subscriberDB");
const User = require('./models/users');
const bcrypt = require('bcrypt');
const saltRounds = 10;





app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}))



app.get('/', (req, res) => {

    res.render('home')

})

app.get('/login', (req, res) => {

    res.render('login')

})

app.get('/register', (req, res) => {

    res.render('register')

})


app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds)
        .then(hash => {

            const newUser = new User({

                email: req.body.username,
                password: hash




            })

            newUser.save().then(result => {

                res.render('secrets')

            }).catch(err => {

                console.log(err)
            });



        })


    // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //     const newUser = new User({

    //         email: req.body.username,
    //         password: hash




    //     })

    //     newUser.save().then(result => {

    //         res.render('secrets')

    //     }).catch(err => {

    //         console.log(err)
    //     });

    // });





})


app.post('/login', (req, res) => {

    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({
            email: userName
        })
        .then(foundUser => {


            bcrypt.compare(password, foundUser.password).then(result => {

                if (result == true) {

                    res.render('secrets');

                } else {

                    res.send(`unauthorised`)
                }


            })




        })
        .catch(err => {

            console.log(err)
        })


})


app.get('/logout', (req, res) => {


    res.render('home')
})


app.listen(3000, () => {

    console.log(`server started on port 3000`)

})