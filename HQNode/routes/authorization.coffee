express = require 'express'
mongoose = require 'mongoose'
security = require '../security/security'
User = require '../models/users'
Session = require '../models/session'
log = require '../utils/logger'

router = express.Router()

login = (request, response) ->
  criteria =
    email: request.body.username,
  User.findOne criteria, (error, user) ->
    if error then response.sendStatus 500
    if user
      user.comparePassword request.body.password, (error, isMatch) ->
        if isMatch
          result =
            token: security.generateToken(user.email)
            user: user.authResponse()
          expirationDate = new Date
          expirationDate.setMinutes(expirationDate.getMinutes + 30)
          session = {}
          session.userId = user._id;
          session.securityToken = result.token
          session.expirationDate = expirationDate
          Session.findOneAndUpdate(session.userId, session, {upsert: true}, (error, session) ->
            if error
              log.error error
              response.sendStatus 409
            else response.json result
          )
        else
          response.sendStatus 403
    else
      response.sendStatus 403

logout = (request, response) ->
  criteria =
    userId: request.body.userId
    securityToken: request.body.securityToken
  Session.findOneAndRemove criteria, (error) ->
    if error then log.error error
    response.sendStatus 200

router.post   '/login',   login
router.post   '/logout',  logout

module.exports = router
