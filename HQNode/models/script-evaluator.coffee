vm = require 'vm'
util = require 'util'
_ = require 'underscore'

module.exports = class ScriptEvaluator
  sandbox = null

  constructor: (@task) ->
    p = @task.data.metadata.performers
    a = @task.data.metadata.acceptedBy
    r = @task.data.metadata.rejectedBy

    if a is undefined
      a = []

    if r is undefined
      r = []

    sandbox =
      performers: p
      acceptedBy: a
      rejectedBy: r
      deadline: @task.data.metadata.deadline

      performersContain: (candidate) ->
        result = _.find sandbox.performers, (performer) ->
          possibilities = [
            performer.email
            performer.firstName
            performer.lastName
            performer.firstName + ' ' + performer.lastName
          ]
          return candidate in possibilities
        return result isnt undefined

      isBeforeDeadline: ->
        if sandbox.deadline
          if sandbox.deadline instanceof Date
            return sandbox.deadline > Date.now()
          else
            try
              return new Date(sandbox.deadline) > Date.now()
            catch error
              return false
        else
          return false

  evaluate: ->
    try
      return vm.runInNewContext @task.data.metadata.script, sandbox
    catch error
      console.log error
      return false
