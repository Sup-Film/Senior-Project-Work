const mongoose = require('mongoose');

const FlashcardSchema = new mongoose.Schema({
   card_question: String,
   card_answer: String,
   deck_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deck'
   },
   stat: Number,
   total: Number,
   correct: Number,
   wrong: Number,
});

module.exports = mongoose.model('Flashcard', FlashcardSchema);