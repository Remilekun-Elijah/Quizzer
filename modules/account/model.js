const mongoose = require('mongoose');
mongoose.set("returnOriginal", false);

// destructure mongoose.Schema and mongoose.model
const { Schema, model } = mongoose;

const accountSchema = new Schema({
 email: {
   type: String,
   required: true,
   unique: true,
   trim: true,
   lowercase: true,
   minlength: 3,
   maxlength: 100
 },
 password: {
   type: String,
   required: true,
   trim: true,
   minlength: 8,
   maxlength: 300
 },
 passwordArchived: [
    {
      type: String,
      trim: true,
      minlength: 8,
      maxlength: 300
    }
 ],
 status: {
   type: String,
   trim: true,
   minlength: 3,
   maxlength: 100,
   enum: ['active', 'inactive', 'suspended'],
   default: 'inactive'
 },
role: {
  type: String,
  trim: true,
  minlength: 3,
  maxlength: 100,
  enum: ['admin', 'superAdmin', 'student'],
  default: 'student'
},
 createdAt: {
   type: Date,
   default: Date.now
 },
 updatedAt: {
   type: Date,
   default: Date.now 
 }
});


module.exports = model('Accounts', accountSchema);