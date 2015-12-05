mongoose = require 'mongoose'
bcrypt = require 'bcrypt'
saltFactor = 10

Schema = mongoose.Schema

UserSchema = new Schema
  email:
    type: String,
    required: true,
    index:
      unique: true
  password:
    type: String,
    required: true
  firstName:
    type: String,
    required: true
  lastName:
    type: String,
    required: true
  phone:
    type: String
  mobilePhone:
    type: String


UserSchema.pre 'save', (next) ->
  user = this;
  return next() if not user.isModified('password')
  bcrypt.genSalt saltFactor, (error, salt) ->
    return next(error) if error
    bcrypt.hash user.password, salt, (error, hash) ->
      return next(error) if error
      user.password = hash
      next()

UserSchema.methods.comparePassword = (candidate, callback) ->
  bcrypt.compare candidate, this.password, (error, isMatch) ->
    return callback(error) if error
    callback(null, isMatch)

UserSchema.methods.authResponse = ->
  user =
    id: this._id
    email: this.email
  return user

UserSchema.methods.fullName = ->
  return this.firstName + ' ' + this.lastName

UserSchema.methods.forClient = ->
  output =
    id: this._id
    email: this.email
    firstName: this.firstName
    lastName: this.lastName
    phone: this.phone
    mobilePhone: this.mobilePhone
    fullName: this.firstName + ' ' + this.lastName
  return output

module.exports = mongoose.model 'User', UserSchema
