const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === 'string' && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function (reqBody) {
    return Object.keys(reqBody).length > 0
}

const emailValidation = function (email) {
    let regexForEmail = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/
    return regexForEmail.test(email)
}

const mobileValidation = function (phone) {
    let regexForMobile = /^[6-9]\d{9}$/
    return regexForMobile.test(phone)
}

const isValidPassword = function (password) {
    let regexforpassword = /^(?=.*\d)(?=.*[a-z]).{8,15}$/
    return regexforpassword.test(password)
}
const isValidEnum = function (value) {
    if (["Maths", "english", "Hindi", "Science"].find(element => element === value)) return true;
    return false;
}

const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isvalidNumber = function (value) {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === 'string' && value.trim().length === 0) return false
    if (typeof (value) === 'number') return true

}
module.exports = { isValid, isValidRequestBody, emailValidation, mobileValidation, isValidPassword, isValidEnum, isValidObjectId, isvalidNumber }