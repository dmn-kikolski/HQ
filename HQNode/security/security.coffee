jsonWebToken = require 'jsonwebtoken'
bcrypt = require 'bcrypt'

secretKey = 'IQV7YgkREX101lf9ix9Ibcq2z2kUDT9RaclPm3HCX5mp0gsIhlO2D6dX0LRQbq32'
additionalOptions =
  expiresInMinutes: 180
saltFactor = 10

exports.generateToken = (user) ->
  return jsonWebToken.sign(user, secretKey, additionalOptions)

exports.verifyToken = (token) ->
  return jsonWebToken.verify(token, secretKey)

exports.generateInitialPassword = (firstName, lastName) ->
  tempPassowrd = firstName + lastName;
  bcrypt.hash tempPassowrd, '', (error, hash) ->
    return tempPassowrd if error
    return hash.substring 0, 6

exports.generatePasswordHash = (password) ->
  bcrypt.genSalt saltFactor, (error, salt) ->
    return '' if error
    bcrypt.hash password, salt, (error, hash) ->
      return '' if error
      return hash
