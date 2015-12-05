log = require '../utils/logger'
express = require 'express'
mongoose = require 'mongoose'
Product = require '../models/product'
User = require '../models/users'
WorkflowDataSelector = require '../models/workflow-data-selector'
ProductProcessor = require '../models/product-workflow-processor'
router = express.Router()

get = (request, response) ->
  workflowDataSelector = new WorkflowDataSelector()
  result = []
  Product.find {}, (error, products) ->
    if error then response.sendStatus 500
    else
      for product in products
        if product.state isnt 'Not running'
          workflowDataSelector.setWorkflow product.workflow
          task = workflowDataSelector.getActiveTask()
          if _taskShouldBeReturned(task, request.params.userId)
            _addProductIdToResults(task, product)
            _removeRedundantData(task)
            result.push task
      response.json result

accept = (request, response) ->
  productId = request.body.productId
  userId = request.body.userId
  taskId = request.body.taskId
  Product.findById productId, (error, product) ->
    if error
      response.sendStatus 500
    else
      workflow = product.getWorkflow()
      graph =
        nodes: workflow.nodes
        edges: workflow.edges
      productProcessor = new ProductProcessor(product, graph)
      productProcessor.markTaskAsAccepted(userId, taskId)
      processedGraph = productProcessor.process()
      product.workflow.nodes = processedGraph.nodes
      product.workflow.edges = processedGraph.edges
      product.workflow.activeNode = processedGraph.activeNode
      product.save (error) ->
        if error then console.log 'error'
        else
          response.sendStatus 200

reject = (request, response) ->
  productId = request.body.productId
  userId = request.body.userId
  taskId = request.body.taskId
  Product.findById productId, (error, product) ->
    if error
      response.sendStatus 500
    else
      workflow = product.getWorkflow()
      graph =
        nodes: workflow.nodes
        edges: workflow.edges
      productProcessor = new ProductProcessor(product, graph)
      productProcessor.markTaskAsRejected(userId, taskId)
      processedGraph = productProcessor.process()
      product.workflow.nodes = processedGraph.nodes
      product.workflow.edges = processedGraph.edges
      product.workflow.activeNode = processedGraph.activeNode
      product.save (error) ->
        if error then console.log 'error'
        else
          response.sendStatus 200


getTasksAssignedToUser = (request, response) ->

getUndoneTasksAssignedToUser = (request, response) ->
  response.sendStatus 200

_addProductIdToResults = (task, product) ->
  task.productId = product._id;

_removeRedundantData = (task) ->
  delete task.backgroundColor
  delete task.fontColor
  delete task.height
  delete task.shape
  delete task.width
  delete task.type

_taskShouldBeReturned = (task, userId) ->
  if task is null then return false
  isInPerformers = task.data.metadata.performers.indexOf(userId) > -1
  isntDone = task.data.metadata.state isnt 'done'
  return isInPerformers && isntDone

router.get    '/get/:userId', get
router.post   '/accept',      accept
router.post   '/reject',      reject

module.exports = router
