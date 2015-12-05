assert = require 'assert'
ScriptEvaluator = require '../models/script-evaluator'

describe 'scriptEvaluator', ->
  scriptEvaluator = null
  task = null

  beforeEach () ->
    task =
      data:
        metadata:
           script: 'return success;'
           deadline: '2016-08-25'
           performers: [
            {id: 1, firstName: "Damian", lastName: "Kikolski", email: "damkik@office.com.pl"}
           ]
           acceptedBy: []
           rejectedBy: []
           description: 'desc'
           summary: 'Task id: 1n'
        id: '1n'
        type: 'task'

  invokeScriptEvaluator = (script)->
    task.data.metadata.script = script
    scriptEvaluator = new ScriptEvaluator task
    return scriptEvaluator.evaluate()

  describe '#evaluate', ->
    it 'should pass when script returns true as boolean value', ->
      assert.equal true, invokeScriptEvaluator('true')

    it 'should return true when task is before deadline', ->
      script = 'if (isBeforeDeadline()) true; else false;'
      assert.equal true, invokeScriptEvaluator(script)

    it 'should return false when task doesnt meet deadline', ->
      task.data.metadata.deadline = '2015-01-01'
      script = 'if (isBeforeDeadline()) true; else false;'
      assert.equal false, invokeScriptEvaluator(script)

    it 'should return true when performer was found by first name', ->
      script = "if (performersContain('Damian')) true; else false;"
      assert.equal true, invokeScriptEvaluator(script)

    it 'should return true when performer was found by last name', ->
      script = "if (performersContain('Kikolski')) true; else false;"
      assert.equal true, invokeScriptEvaluator(script)

    it 'should return true when performer was found by email', ->
      script = "if (performersContain('damkik@office.com.pl')) true; else false;"
      assert.equal true, invokeScriptEvaluator(script)

    it 'should return true when performer was found by email', ->
      script = "if (performersContain('damkik@office.com.pl')) true; else false;"
      assert.equal true, invokeScriptEvaluator(script)

    it 'should return true when performer was found by full name', ->
      script = "if (performersContain('Damian Kikolski')) true; else false;"
      assert.equal true, invokeScriptEvaluator(script)

    it 'should return true when performers length is equal 1', ->
      script = "if (acceptedBy.length === 1) true; else false;"
      assert.equal true, invokeScriptEvaluator(script)

    it 'should return undefined when acceptedBy and rejectedBy are empty', ->
      script = "if (acceptedBy.length === 1) true; else if (rejectedBy.length === 1) false; else undefined;"
      assert.equal undefined, invokeScriptEvaluator(script)
