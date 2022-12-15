const StudentModel = require('../Models/StudentModel')

const UserModel = require('../Models/UserModel')

const { isValidObjectId, isValidRequestBody, isvalidNumber, isValidEnum, isValid } = require('../Validation/validator')


const Createstudent = async function (req, res) {
  try {
    const data = req.body

    if (!isValidRequestBody(data))

      return res.status(400).send({ status: false, message: "Enter data to create Student" })

    let { studentName, marks, subject } = data
    let userId = req.params.userId
    data.userId = userId
    if (!userId)
      return res.status(400).send({ status: false, message: 'userId is required' })

    if (!isValidObjectId(userId))

      return res.status(400).send({ status: false, message: " UserId is inValid" })

    const checkUser = await UserModel.findOne({ _id: userId })

    if (!checkUser)

      return res.status(400).send({ status: false, message: "user not found" })

    if (!isValid(studentName)) {

      return res.status(400).send({ status: false, message: "Please enter a valid student name" })
    }

    if (!isvalidNumber(marks)) {

      return res.status(400).send({ status: false, message: "please enter a valid marks" })
    }

    if (!isValidEnum(subject)) {

      return res.status(400).send({ status: false, message: "Please enter subject properly" })

    }

    let checkname = await StudentModel.findOne({ studentName: studentName, subject: subject })

    if (checkname) {

      let marksadd = await StudentModel.findOneAndUpdate(
        { studentName: studentName, subject: subject },
        { $set: { marks: checkname.marks + data.marks }, },
        { new: true }
      )
      return res.status(200).send({ status: true, message: marksadd })

    }

    let student = await StudentModel.create(data);

    res.status(201).send({ status: true, message: "User created Successfully", data: student });

  }

  catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, message: err.message })

  }
}




const getDetailsByQuery = async function (req, res) {
  try {
    let data = req.query;
    let userId = req.params.userId
    let filter = { isDeleted: false }
    filter.userId = userId

    if (Object.keys(data).length == 0) {
      let allStudentss = await StudentModel.find(filter).sort({ studentName: 1 })
      if (allStudentss.length == 0) {
        return res.status(404).send({ status: false, message: "No student found" })
      }
      return res.status(200).send({ status: false, message: "All Students", data: allStudentss })
    }

    let { studentName, subject } = data

    if (studentName || subject) {

      if (studentName) {
        filter.studentName = { $regex: studentName };
      }

      const foundStudents = await StudentModel.find(filter).select({ __v: 0 })


      if (foundStudents.length == 0) {
        return res.status(404).send({ status: false, message: "Students not found for the given query" })
      }

      return res.status(200).send({ status: "true", message: 'Success', data: foundStudents })

    } else {
      return res.status(400).send({ status: false, message: "Invalid filters or query" })
    }

  } catch (err) {
    console.log(err)
    return res.status(500).send({ status: false, message: err.message })
  }
}

const updateDetails = async (req, res) => {
  try {
    let { studentName } = req.query

    let available = await StudentModel.findOne({ studentName: studentName, isDeleted: false })
    if (!available) {
      return res.status(404).send({ status: false, message: "Student doesnot exists." })
    }

    let data = req.body
    let { subject, marks } = data

    if ((Object.keys(data).length == 0)) {
      return res.status(400).send({ status: false, message: "Please provide appropriate details for editing" })
    }

    if (!subject && !marks) {
      return res.status(400).send({ status: false, message: "Invalid request body" })
    }

    let editor = {}

    if (subject) {
      if (!isValidEnum(subject)) {

        return res.status(400).send({ status: false, message: "Please enter subject properly" })

      }
      editor.subject = subject
    }

    if (marks) {
      if (!isvalidNumber(marks)) {

        return res.status(400).send({ status: false, message: "please enter a valid marks" })
      }
      editor.marks = marks
    }

    let updateData = await StudentModel.findOneAndUpdate({ studentName: studentName, isDeleted: false },
      { $set: editor },
      { new: true })
    if (!updateData) {
      return res.status(404).send({ status: false, message: "Student not found" })
    }
    return res.status(200).send({ status: true, message: "Successful", data: updateData })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, error: error.message })
  }
}


const deleteStudents = async (req, res) => {
  try {

    let {studentName}  = req.query

    if(!isValid(req.query)){

      return res.status(400).send({status : false , message : "Please provide student name to update data"})
    }

    let findStudent = await StudentModel.findOne({ studentName: studentName, isDeleted: false });
    if (!findStudent) {
      return res.status(404).send({ status: false, message: `No student found by name ${studentName}` });
    }
    if (findStudent.isDeleted == true) {
      return res.status(400).send({ status: false, message: `Student has been already deleted.` });
    }

    let deletedStudent = await StudentModel.findOneAndUpdate({ studentName: studentName },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true });

  
    return res.status(200).send({ status: true, message: "student deleted successfully.", data: deletedStudent });

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: err.message });
  }
}


module.exports = { Createstudent, getDetailsByQuery, updateDetails, deleteStudents }