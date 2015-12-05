###
Struktura grafu

graph =
  nodes: Array
  edges: Array

edge:
  data =
    target: String
    source: String
    type: String [zawsze "edge"]
    id: String
    metadata = [opcjonalne]
      rule: String [dla krawedzi wychodzacych z wezla "task"]

node:
  position =
    y: Number [nieistotne]
    x: Number [nieistotne]
  data =
    fontColor: [nieistotne]
    backgroundColor: [nieistotne]
    type: String ['task' dla wezla oznaczajacego zadanie]
    height: String [nieistotne]
    width: String [nieistotne]
    shape: String [nieistotne]

task-node:
[to co wyzej tylko..]
  data =
    metadata =
      script: String [Skrypt do wykonania]
      performers: Array [Identyfikatory osob odpowiedzialnych za wykonanie zadania]
      description: String [Opis zadania]
      summary: String [Tytul zadania]
      state: String ['done' dla wykonanego]
    id: String [identyfikaotr]

state-node:
  [to co wyzej tylko..]
  data =
    metadata =
      summary: String [nazwa stanu]
      state: String ['done' dla wykonanego]

notification-node:
  [to co wyzej tylko..]
  data =
    metadata =
      message: String [wiadomosc do wyslania]
      receivers: String [adresy e-mail odbiorcow oddzielone przecinkiem]
      summary: String [nazwa notyfikacji]
      state: String ['done' dla wykonanego]

###
log = require '../utils/logger'
MailSender = require './mail-sender'
ScriptEvaluator = require './script-evaluator'

class ProductProcessor
  constructor: (@product, @workflow) ->
    @graph = @workflow

  process: ->
    log.info 'ProductProcessor | process | start: '
    log.info '--------------------------------------------------------\n', @graph
    log.info '\n--------------------------------------------------------\n\n'
    processingStatus = true;
    while (processingStatus)
      activeNode = @getActiveNode()
      log.info 'ProductProcessor | process | active node: ', activeNode
      nodeType = @getNodeType activeNode
      log.info 'ProductProcessor | process | node type: ', nodeType
      switch nodeType
        when 'task'
          processingStatus = @processTask()
        when 'notification'
          processingStatus = @processNotification()
        when 'stateChange'
          processingStatus = @processStateChange()
        when 'end'
          log.info 'ProductProcessor | process | active node: end'
          @product.state = 'END'
          for node in @graph.nodes
            if node.data.type is 'end'
              node.data.backgroundColor = '#0A9AC9'
          return @graph
    return @graph

  getActiveNode: ->
    nodes = @graph.nodes
    edges = @graph.edges
    if @graph.activeNode then return @graph.activeNode
    else
      for node in nodes
        if node.data.type is 'start'
          addSomeStyleToNode(node)
      for edge in edges
        if edge.data.source is 'start'
          addSomeStyleToEdge edge
          @graph.activeNode = @getNodeById edge.data.target
          return @graph.activeNode

  setActiveNode: (node) ->
    @graph.activeNode = node

  getNodeById: (value) ->
    for node in @graph.nodes
      if node.data.id is value
        return node
    return null

  getTasks: ->
    tasks = []
    for node in @graph.nodes
      tasks.push node if isTask node
    return tasks

  isStartNode = (node) ->
    return node.data.type is 'start'

  isEndNode = (node) ->
    return node.data.type is 'end'

  isTask = (node) ->
    return node.data.type is 'task'

  isNotification = (node) ->
    return node.data.type is 'notification'

  isState = (node) ->
    return node.data.type is 'state'

  getNodeType: (node) ->
    return node.data.type

  addSomeStyleToNode = (node) ->
    node.data.outlineColor = '#0A9AC9'

  addSomeStyleToEdge = (edge) ->
    edge.data.color = '#0A9AC9'
    edge.data.edgeWidth = '6'

  getFollowingNode: (node, rule) ->
    if rule
      for edge in @graph.edges
        if edge.data.source is node.data.id and edge.data.metadata.rule is rule
          addSomeStyleToEdge edge
          return @getNodeById edge.data.target
      return null
    else
      for edge in @graph.edges
        if edge.data.source is node.data.id
          addSomeStyleToEdge edge
          return @getNodeById edge.data.target
      return null

  processStateChange: ->
    node = @getActiveNode()
    addSomeStyleToNode node
    @product.state = node.data.metadata.summary
    follower = @getFollowingNode node
    @setActiveNode follower
    log.info 'ProductProcessor | process state change | current node: ', node
    log.info 'ProductProcessor | process state change | following node: ', follower
    log.info 'ProductProcessor | process state change | current product state: ', @product.state
    return true

  processTask: ->
    node = @getActiveNode()
    addSomeStyleToNode node
    scriptEvaluator = new ScriptEvaluator node
    result = scriptEvaluator.evaluate()
    log.info 'ProductProcessor | process task | current node: ', node
    log.info 'ProductProcessor | process task | script evaluate result: ', result
    if result is true
      node.data.metadata.state = 'done'
      followingNode = @getFollowingNode(node, 'success')
      log.info 'ProductProcessor | process task | success edge processing | following node: ', followingNode
      @setActiveNode(followingNode)
    else if result is false
      node.data.metadata.state = 'done'
      followingNode = @getFollowingNode(node, 'failure')
      log.info 'ProductProcessor | process task | failure edge processing | following node: ', followingNode
      @setActiveNode(followingNode)
    else
      log.info 'ProductProcessor | process task | staying in the same node.'
      return false
    return true

  markTaskAsAccepted: (userId, nodeId) ->
    log.info 'ProductProcessor | markTaskAsAccepted |'
    log.info ('Data: ' + userId + ' nodeID: ' + nodeId)
    nodes = @graph.nodes
    for node in nodes
      if node.data.id is nodeId
        if node.data.metadata.acceptedBy is undefined
          node.data.metadata.acceptedBy = []
        node.data.metadata.acceptedBy.push userId
    log.info 'ProductProcessor | markTaskAsAccepted | END | node: ', node

  markTaskAsRejected: (userId, nodeId) ->
    log.info 'ProductProcessor | markTaskAsRejected |'
    log.info ('Data: ' + userId + ' nodeID: ' + nodeId)
    nodes = @graph.nodes
    for node in nodes
      if node.data.id is nodeId
        if node.data.metadata.rejectedBy is undefined
          node.data.metadata.rejectedBy = []
        node.data.metadata.rejectedBy.push userId
    log.info 'ProductProcessor | markTaskAsRejected | END | node: ', node

  processNotification: ->
    mailSender = new MailSender
    node = @getActiveNode()
    addSomeStyleToNode node
    #mailSender.sendNotification node
    log.info 'ProductProcessor | process notification | current node: ', node
    log.info 'ProductProcessor | process notification | SENDING E-MAIL'
    log.info 'ProductProcessor | process notification | SENDING E-MAIL | RECEIVERS: ', node.data.metadata.receivers
    log.info 'ProductProcessor | process notification | SENDING E-MAIL | MESSAGE: ', node.data.metadata.message
    follower = @getFollowingNode node
    log.info 'ProductProcessor | process notification | following node: ', follower
    @setActiveNode follower
    return true

module.exports = ProductProcessor
