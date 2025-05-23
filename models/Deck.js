const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
   deck_name: String,
   deck_des: String,
   admin_id: String,
   teacher_id: String,
   classroom_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom'
   },
   flashcards: [{
      type: mongoose.Schema.Types.ObjectId, // กำหนดชนิดข้อมูลเป็น ObjectId
      ref: 'Flashcard' // อ้างอิงไปยังโมเดล Flashcard
   }],
   quizzes: [{
      type: mongoose.Schema.Types.ObjectId, // กำหนดชนิดข้อมูลเป็น ObjectId
      ref: 'Quiz'
   }]
});

module.exports = mongoose.model('Deck', DeckSchema);