var mongoose = require('mongoose');

var Customer = mongoose.model('customer', {
    firstname:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    lastname:{
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    zipcode:{
        type: Number,
        required: true,
        minlength: 5
    }
});

module.exports = {
    Customer
};