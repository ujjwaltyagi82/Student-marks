const express = require('express');
const router = express.Router();
const userController = require("../Controllers/UserController")
const studentController = require("../Controllers/StudentController")
const {authentication, authorization} = require('../Middelwares/Auth')

router.post('/register' , userController.createUser) // register

router.post('/login' , userController.loginUser) // login

router.get('/students/:userId', authentication, authorization, studentController.getDetailsByQuery) // list of students acc to query

router.post('/student/:userId' , authentication,studentController.Createstudent ) // add student

router.put('/student/:userId', authentication, authorization, studentController.updateDetails)// edit details

router.delete('/student/:userId', authentication, authorization, studentController.deleteStudents)// edit details


module.exports = router;