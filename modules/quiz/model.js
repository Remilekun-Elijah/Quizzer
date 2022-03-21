const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set("returnOriginal", false);

// destructure mongoose.Schema and mongoose.model
const { Schema, model } = mongoose;

// create quiz schema
const quizSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 1000
  },
  instruction: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 1000
  },
  coverImage: {
    type: String,
    trim: true,
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Questions'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  passMark: {
    type: Number,
    default: 0
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Account'
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

exports.QuizModel = model('Quiz', quizSchema);

const QuestionsSchema = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  question: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 1000
  },
  wrongAnswers: [{
    type: String,
    trim: true,
    required: true,
    maxlength: 1000
  }],
  correctAnswer: {
    type: String,
    trim: true,
    required: true,
    maxlength: 1000
  },
  marks: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
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

exports.QuestionModel = model('Questions', QuestionsSchema);


const quizTakenSchema = new Schema({
quiz: {
  type: Schema.Types.ObjectId,
  ref: 'Quiz'
},
user: {
  type: Schema.Types.ObjectId,
  ref: 'Account'
},
questions:  [{
  type: Object,
  required: true
}],
status: {
  type: String,
  required: true,
  trim: true,
  enum: ['pending','passed', 'failed', 'held'],
  default: 'pending'
},
score: {
  type: Number,
  default: 0,
  required: true
},
adminComment: {
  type: String,
  trim: true,
  maxlength: 1000
},
timeStarted: {
  type: Date,
  default: Date.now
},
timeEnded: {
  type: Date,
  default: Date.now
},
timeTaken: {
  type: Number,
  default: 0
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

exports.quizTakenModel = model('QuizTaken', quizTakenSchema);

/*
// users sees this
 Time 60s
 What is the capital of Nigeria?
 1. Lagos
 2. Abuja
 3. Kaduna
 4. Kano


*/

