mongoose = require 'mongoose'
express = require 'express'
Product = require '../models/product'
log = require '../utils/logger'
User = require '../models/users'
ProductProcessor = require '../models/product-workflow-processor'
router = express.Router()

create = (request, response) ->
  criteria =
    email: request.body.creator;
  User.findOne criteria, (error, result) ->
    if error then response.sendStatus 500
    else
      user =
        id: result._id
        name: result.firstName + ' ' + result.lastName
      product = new Product
        name: request.body.name
        state: 'Not running'
        description: request.body.desc
        creator: user
        workflow:
          nodes: request.body.graph.nodes
          edges: request.body.graph.edges
      product.save (error, product) ->
        if error then response.sendStatus 500
        else response.sendStatus 200

getAllBasicInfo = (request, response) ->
  selectFields = '_id name description creator creationDate state'
  Product.find {}, selectFields, (error, result) ->
    if error then response.sendStatus 404
    else response.json result

getById = (request, response) ->
  Product.findById request.params.id, (error, result) ->
    if error then response.sendStatus 404
    else
      response.json result

getBasicInfoById = (request, response) ->
  Product.findById request.params.id, (error, result) ->
    if error then response.sendStatus 404
    else
      response.json result

runProcessing = (request, response) ->
  criteria =
    _id: request.body.id
  Product.findOne criteria, (error, product) ->
    if error then response.sendStatus 404
    else
      workflow = product.getWorkflow()
      graph =
        nodes: workflow.nodes
        edges: workflow.edges
      productProcessor = new ProductProcessor(product, graph)
      processedGraph = productProcessor.process()
      product.workflow.nodes = processedGraph.nodes
      product.workflow.edges = processedGraph.edges
      product.workflow.activeNode = processedGraph.activeNode
      if product.state is 'Not running'
        product.state = 'Started'
      product.save (error) ->
        if error then console.log 'error'
        else
          response.sendStatus 200



router.post   '/create',    create
router.post   '/run',       runProcessing
router.get    '/all',       getAllBasicInfo
router.get    '/get/:id',   getById
router.get    '/getBasic/:id', getBasicInfoById

module.exports = router
