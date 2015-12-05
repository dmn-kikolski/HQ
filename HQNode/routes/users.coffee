express = require 'express'
mongoose = require 'mongoose'
security = require '../security/security'
log = require '../utils/logger'
User = require '../models/users'

router = express.Router()

all = (request, response) ->
  User.find {}, (error, users) ->
    if error then response.sendStatus 500
    else
      # result = (user.forClient() for user in users)
      response.json users

create = (request, response) ->
  r = request.body
  user = new User
    email: r.email
    #password: security.generateInitialPassword r.firstName, r.lastName
    password: 'test'
    firstName: r.firstName
    lastName: r.lastName
  user.save (error) ->
    if error
      log.error 'User | create | error', error
      response.sendStatus 500
    else
      # sending email with password removed for tesing purposes
      log.info 'User created: ', user
      response.sendStatus 200

remove = (request, response) ->
  User.findByIdAndRemove request.body.id, (error, result) ->
    if error then response.sendStatus 500
    else response.sendStatus 200

details = (request, response) ->
  User.findById request.params.id, (error, user) ->
    if error then response.sendStatus 500
    else response.json user

profile = (request, response) ->
  criteria =
    email: request.body.email
  User.findOne criteria, (error, user) ->
    if (error) then response.sendStatus 500
    else response.json user

edit = (request, response) ->
  criteria =
    email: request.body.email
  newData =
    firstName: request.body.firstName
    lastName: request.body.lastName
    phone: request.body.phone
    mobilePhone: request.body.mobilePhone
  User.findOneAndUpdate criteria, newData, (error, user) ->
    if error then response.sendStatus 500
    else response.sendStatus 200

editPassword = (request, response) ->
  input = request.body
  if input.new isnt input.newRepeated then response.sendStatus 400
  else
    User.findById input.userId, (error, user) ->
      if error then response.sendStatus 500
      else
        user.password = security.generatePasswordHash(input.new)
        user.save (error) ->
          if error
            log.error error
            response.sendStatus 500
          else response.sendStatus 200

router.get    '/',                            all
router.get    '/details/:id',                 details
router.post   '/create',                      create
router.post   '/remove',                      remove
router.post   '/profile',                     profile
router.post   '/details/edit',                edit
router.post   '/password/edit',               editPassword


module.exports = router
