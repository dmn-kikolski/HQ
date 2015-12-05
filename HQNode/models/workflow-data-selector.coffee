log = require '../utils/logger'

class WorkflowDataSelector
  getTasks: ->
    log.info 'WorkflowDataSelector| getTasks | workflow: ', JSON.stringify(@workflow)
    nodes = @workflow.nodes
    tasks = []
    for node in nodes
      if node.data.type is 'task'
        log.info 'Processing task: ', node
        tasks.push node.data
    return tasks;

  getActiveTask: ->
    log.info 'WorkflowDataSelector| getActiveTask | workflow: ', JSON.stringify(@workflow)
    if @workflow.activeNode && @workflow.activeNode.data.type is 'task'
       @workflow.activeNode
    else return null

  getTasksForUser: (userId) ->
    log.info 'WorkflowDataSelector| getTasksForUser | workflow: ', JSON.stringify(@workflow)
    nodes = @workflow.nodes
    tasks = []
    for node in nodes
      if _checkType(node, 'task') and _perfomersContain(node, userId)
        tasks.push node.data
    return tasks;

  getStates: ->
    log.info 'WorkflowDataSelector| getStates | workflow: ', JSON.stringify(@workflow)
    nodes = @workflow.nodes
    states = []
    for node in nodes
      if node.data.type is 'state'
        states.push node.data
    return states

  getNotifications: ->
    nodes = @workflow.nodes
    notifications = []
    for node in nodes
      if node.data.type is 'notification'
        notifications.push node.data
    return notifications

  getUndoneTasks: ->
    nodes = @workflow.nodes
    tasks = []
    for node in nodes
      if node.data.type is 'task' and node.data.metadata.state isnt 'done'
        tasks.push node
    return tasks

  setWorkflow: (workflow) ->
    @workflow = workflow

  _perfomersContain: (task, user) ->
    for performer in task.data.metadata.performers
      if user is performer
        return yes
    return no

  _checkType: (node, type) ->
    return node.data.type is type

module.exports = WorkflowDataSelector
