require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/subscriberDB")
const User = require('./models/users');





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


    const newUser = new User({

        email: req.body.username,
        password: req.body.password




    })

    newUser.save().then(result => {

        res.render('secrets')

    }).catch(err => {

        console.log(err)
    });




})


app.post('/login', (req, res) => {

    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({
            email: userName
        })
        .then(foundUser => {

            if (foundUser.password === password) {

                res.render('secrets')
            } else {

                res.send(`unauthorised`)
            }


        })
        .catch(err => {

            console.log(err)
        })


})


app.listen(3000, () => {

    console.log(`server started on port 3000`)

})