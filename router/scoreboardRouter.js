const express = require('express');
const scoreboardRouter = express.Router();
const mongoose = require('mongoose');
const Scoreboard = require('../models/Scoreboard');
const Student = require('../models/Student');
const Deck = require('../models/Deck');

// Get Scoreboard
scoreboardRouter.get('/:deckId', (req, res, next) => {
  Scoreboard.find({ deck_id: req.params.deckId })
    .populate('deck_id')
    .populate('scores.student_id')
    .then((scoreboard) => {
      res.json(scoreboard);
    })
    .catch((err) => {
      next(err);
    });
});

// Post Scoreboard
scoreboardRouter.post('/:deckId', async (req, res, next) => {
  console.log('Body', req.body)
  const studentId = req.body.student_id;
  const score = req.body.score;
  const correctAnswers = req.body.correctAnswers;
  const incorrectAnswers = req.body.incorrectAnswers;
  const deckId = req.params.deckId;


  try {
    const deck = await Deck.findById(deckId);
    const student = await Student.findById(studentId);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // หาว่ามี scoreboard ของ deck นี้อยู่แล้วหรือยัง
    const existingScoreboard = await Scoreboard.findOne({ deck_id: deckId });
    // ถ้ามี scoreboard ของ deck นี้อยู่แล้ว
    if (existingScoreboard) {
      // หา index ของ student_id ใน scores array
      const index = existingScoreboard.scores.findIndex(s => s.student_id.toString() === studentId);
      if (index !== -1) { // ถ้าเจอ student_id ใน scores array
        if (score > existingScoreboard.scores[index].score) {
          existingScoreboard.scores[index].score = score;
          existingScoreboard.scores[index].correctAnswers = correctAnswers;
          existingScoreboard.scores[index].incorrectAnswers = incorrectAnswers;
        }
      } else {
        // Add a new score
        existingScoreboard.scores.push({
          student_id: studentId,
          score: score,
          correctAnswers: correctAnswers,
          incorrectAnswers: incorrectAnswers
        });
      }
      await existingScoreboard.save();
      res.status(201).json(existingScoreboard);
    } else {
      const newScoreboard = new Scoreboard({
        deck_id: deckId,
        scores: [{
          student_id: studentId,
          score: score,
          correctAnswers: correctAnswers,
          incorrectAnswers: incorrectAnswers
        }]
      });
      await newScoreboard.save();
      res.status(201).json(newScoreboard);
    }
  } catch (error) {
    next(error);
  }
});

// Delete Scoreboard
scoreboardRouter.delete('/deleteScoreBoard/:deckId', (req, res, next) => {
  Scoreboard.deleteOne({ deck_id: req.params.deckId })
    .then(() => {
      res.json({ message: 'Scoreboard deleted' });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = scoreboardRouter;