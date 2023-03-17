const mongoose = require("mongoose")

const ObjectId = mongoose.Schema.Types.ObjectId

const marksSchema = new mongoose.Schema({

   studentName: {
      type: String,
      required: true
   },

   subject: {
      type: String,
      enum: ["Maths", "English", "Hindi", "Science"]
   },

   userId: { type: ObjectId, ref: "User" },

   marks: {
      type: Number,
      required: true
   },

   isDeleted: {
      type: Boolean,
      default: false

   },

   deletedAt: {
      type: Date
   }

}, { timestamps: true })

module.exports = mongoose.model('student', marksSchema)