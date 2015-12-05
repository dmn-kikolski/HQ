mongoose = require 'mongoose'

Schema = mongoose.Schema

SessionSchema = new Schema
  userId:
    type: String
    requred: true
    index:
      unique: true
  securityToken:
    type: String
    requred: true
    index:
      unique: true
  creationDate:
    type: Date
    default: Date.now
  expirationDate:
    type: Date

module.exports = mongoose.model 'Session', SessionSchema
