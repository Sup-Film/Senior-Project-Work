const express = require('express');
const loginUserRouter = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Post Router สำหรับ login compare password
loginUserRouter.post('/', (req, res, next) => {
  const { user_email, user_password, user_role } = req.body;

  Student.findOne({ user_email: user_email }).then(user => {
    console.log(user);

    if (user) {
      let cmp = bcrypt.compare(user_password, user.user_password).then((match) => {
        if (match) {
          req.session.userName = user.user_firstname + ' ' + user.user_lastname;
          req.session.userId = user._id;
          req.session.userRole = user.user_role;
          res.json({ message: "Login Success" })
        } else {
          res.json({ message: "Login Fail" })
        }
      })
    } else {
      Teacher.findOne({ user_email: user_email }).then(user => {
        console.log(user);

        if (user) {
          let cmp = bcrypt.compare(user_password, user.user_password).then((match) => {
            if (match) {
              req.session.userName = user.user_firstname + ' ' + user.user_lastname;
              req.session.userId = user._id;
              req.session.userRole = user.user_role;
              res.json({ message: "Login Success" })
            } else {
              res.json({ message: "Login Fail" })
            }
          })
        } else {
          Admin.findOne({ user_email: user_email }).then(user => {
            console.log(user);

            if (user) {
              let cmp = bcrypt.compare(user_password, user.user_password).then((match) => {
                if (match) {
                  req.session.userName = user.user_firstname + ' ' + user.user_lastname;
                  req.session.userId = user._id;
                  req.session.userRole = user.user_role;
                  res.json({ message: "Login Success" })
                } else {
                  res.json({ message: "Login Fail" })
                }
              })
            } else {
              res.json({ message: "Login Fail" })
            }
          })
        }
      })
    }
  });
});

module.exports = loginUserRouter;