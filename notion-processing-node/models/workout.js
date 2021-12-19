const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    1: {
        type: Number,
        required: true,
    },
    2: {
        type: Number,
        required: true,
    },
    3: {
        type: Number,
        required: true,
    },
    Heading: {
        type: String,
        required: true,
    }
});

const exerciseSchema = new Schema({
    name: {
        type: String,
        required: true,
      },
      data: [dataSchema],
});

const workoutSchema = new Schema({
  workout: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  exercises: [exerciseSchema],
}, { timestamps: true });



const Workout = mongoose.model('Workout', workoutSchema);
module.exports = Workout;