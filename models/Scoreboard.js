const mongoose = require('mongoose');

const ScoreboardSchema = new mongoose.Schema({
  deck_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck'
  },
  scores: [{
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    score: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    incorrectAnswers: {
      type: Number,
      default: 0
    }
  }]
});

module.exports = mongoose.model('Scoreboard', ScoreboardSchema);