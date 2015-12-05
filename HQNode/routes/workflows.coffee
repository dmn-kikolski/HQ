express = require 'express'
mongoose = require 'mongoose'
Workflow = require '../models/workflow'
User = require '../models/users'

router = express.Router()

generalInfoFields = 'name description creator editor creationDate editionDate isTemplate'

remove = (request, response) ->
  Workflow.findByIdAndRemove request.body.id, (error, result) ->
    if error
      response.sendStatus 500
    else
      response.sendStatus 200

create = (request, response) ->
  r = request.body
  User.findById r.userId, (error, user) ->
    if error then response 500
    else
      workflow = new Workflow
        name: r.name
        description: r.description
        isWorkingCopy: r.isWorkingCopy
        isTemplate: r.isTemplate
        creator:
          id: user._id
          name: user.fullName()
        editor:
          id: user._id
          name: user.fullName()
        graph:
          nodes: r.graph.nodes
          edges: r.graph.edges
      workflow.save (error, workflow) ->
        if error
          console.error error
          response.sendStatus 500
        else
          response.sendStatus 200

update = (request, response) ->
  r = request.body
  User.findById r.userId, (error, user) ->
    workflowUpdate =
      name: r.name
      description: r.description
      isWorkingCopy: r.isWorkingCopy
      isTemplate: r.isTemplate
      creator: r.creator
      editor: r.editor
      graph:
        nodes: r.graph.nodes
        edges: r.graph.edges
    Workflow.findByIdAndUpdate r.id, workflowUpdate, (error, workflow) ->
      if error
        console.error error
        response.sendStatus 500
      else
        response.sendStatus 200

getTemplatesFullInfo = (request, response) ->
  criteria =
    isTemplate: true
  Workflow.find criteria, (error, workflows) ->
    if error then response.sendStatus 500
    else response.json workflows

getTemplatesBasicInfo = (request, response) ->
  criteria =
    isTemplate: true
  Workflow.find criteria, generalInfoFields, (error, workflows) ->
    if error then reponse.sendStatus 500
    else response.json workflows

getAllBasicInfo = (request, response) ->
  Workflow.find {}, generalInfoFields, (error, result) ->
    if error then response.sendStatus 500
    else response.json result

details = (request, response) ->
  Workflow.findById request.params.id, (error, workflow) ->
    if error then request.sendStatus 500
    else
      response.json workflow

router.post   '/create',          create
router.post   '/remove',          remove
router.post   '/update',          update
router.get    '/templates',       getTemplatesBasicInfo
router.get    '/templates/full',  getTemplatesFullInfo
router.get    '/all',             getAllBasicInfo
router.get    '/details/:id',     details

module.exports = router
