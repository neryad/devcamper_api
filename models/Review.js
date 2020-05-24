const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,'Please add review title']
    },
    text:{
        type:String,
        required:[true,'Please add some text'],
        maxlength:450
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,'Please add rating 1 and 10'],
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    }
});
// Prvente user for submit more that one review for bootcamps
ReviewSchema.index({bootcamp: 1, user:1 },{unique:true});



module.exports = mongoose.model('Review',ReviewSchema);