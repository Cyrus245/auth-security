const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/subscriberDB")
const User = require('./models/users')




const user1 = new User({


    email: "1@gmail.com",
    password: "12345678"
})

user1.save()


            