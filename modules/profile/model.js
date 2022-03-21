const mongoose = require('mongoose');
mongoose.set("returnOriginal", false);

const { Schema, model } = mongoose;

const userProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  firstName: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  lastName: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  number: {
    type: String,
    trim: true,
    minlength: 11,
    maxlength: 100
  },
  avatar: {
    type: String,
    trim: true,
  },
  
  quizTaken: [{
    type: Schema.Types.ObjectId,
    ref: 'QuizTaken'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

exports.userProfileModel = model('UserProfile', userProfileSchema);


const adminProfileSchema = new Schema({
 user: {
   type: Schema.Types.ObjectId,
   ref: 'Account',
   required: true
 },
 firstName: {
   type: String,
   trim: true,
   minlength: 3,
   maxlength: 100
 },
 lastName: {
   type: String,
   trim: true,
   minlength: 3,
   maxlength: 100
 },
 number: {
   type: String,
   trim: true,
   minlength: 11,
   maxlength: 100
 },
 quizCreated: [{
  type: Schema.Types.ObjectId,
  ref: 'Quiz',
  populate: {
    path: 'quizCreated',
    select: 'title, participants, createdAt, updatedAt'
  }
}],

 createdAt: {
   type: Date,
   default: Date.now
 },
 updatedAt: {
   type: Date,
   default: Date.now
 }
});


exports.adminProfileModel = model('AdminProfile', adminProfileSchema);

/*

student Dashboard
Quizes Taken
quiz of interest
quizes passed
performace of student - chart

*/