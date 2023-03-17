const UserModel = require('../Models/UserModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const { isValid, isValidRequestBody, emailValidation, isValidPassword } = require('../Validation/validator')

const createUser = async function (req, res) {
  try {

    const requestBody = req.body

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide input data" });
    }

    let { name, email, password } = requestBody

    if (!isValid(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Name must be provided" });
    }

    if (!isValid(email)) {
      email = email.toLowerCase()
      return res
        .status(400)
        .send({ status: false, message: "email must be Provided" });
    }

    if (!emailValidation(email)) {
      return res
        .status(400)
        .send({ status: false, message: "enter a valid email" });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid password" })
    }

    let securePassword = requestBody.password;

    const encrytedpassword = async function (securePassword) {

      const passwordHash = await bcrypt.hash(securePassword, 10);

      requestBody.password = passwordHash;

    };

    encrytedpassword(securePassword);

    // let encrypt = bcrypt.hash(password, 10, function (err, hash) {
    //   password = hash
    // })

    const isEmailNotUnique = await UserModel.findOne({ email: email })

    if (isEmailNotUnique) {
      return res
        .status(400)
        .send({ status: false, message: "Your email id is already registerd Please log in" })
    }

    let userCreated = await UserModel.create(requestBody);

    res.status(201).send({ status: true, message: "User created Successfully", data: userCreated });

  } catch (error) {

    res
      .status(500)
      .send({ error: error.message })

  }
}

const loginUser = async function (req, res) {

  try {

    let body = req.body;

    const { email, password } = body;

    if (!isValidRequestBody(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter data to login" });
    }

    if (!isValid(email)) {
      email = email.toLowerCase()
      return res
        .status(400)
        .send({ status: false, message: "Enter Email to login" });
    }

    if (!emailValidation(email)) {
      return res
        .status(400)
        .send({ status: false, message: "enter a valid email" });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Password to login" });
    }

    if (!isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid password" })
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .send({ status: false, message: "User not found with this Email" });
    }

    let userPassword = await bcrypt.compareSync(body.password, user.password);

    if (!userPassword) {
      return res
        .status(401)
        .send({ status: false, message: "Password is not correct" });
    }

    let token = jwt.sign(
      {
        userId: user._id,
      },
      "Marks"
    );

    res.setHeader("Authorization", token);

    return res.status(200).send({ status: true, message: "User login Successful", data: { token: token } });


  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


module.exports = { createUser, loginUser }