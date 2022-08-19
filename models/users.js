const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

userSchema = new mongoose.Schema({


    email: String,
    password: String



})


userSchema.plugin(encrypt, {
    secret: process.env.SECRET,
    encryptedFields: ['password']
})

const User = mongoose.model("User", userSchema);

module.exports = User;