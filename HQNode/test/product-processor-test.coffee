assert = require 'assert'
ProductProcessor = require '../models/product-processor'

describe 'productProcessor', ->
  graph = null
  productProcessor = null
  product = null

  beforeEach () ->
    workflow =
      edges: [
        {
          data:
            target: '1n',
            source: 'start'
            type: 'edge'
            id: '1e'
        },
        {
          data:
            target: '3n'
            source: '1n'
            metadata:
              rule: 'success'
              type: 'edge'
            id: '2e'
        },
        {
          data:
            target: 'end'
            source: '3n'
            type: 'edge'
            id: '3e'
        },
        {
          data:
            target: '2n'
            source: '1n'
            metadata:
              rule: 'failure'
            type: 'edge'
            id: '4e'
        },
        {
          data:
            target: 'end'
            source: '2n'
            type: 'edge'
            id: '5e'
        }
      ]
      nodes: [
        {
          data:
            metadata:
              state: 'undone'
              editable: false
              summary : 'start'
            type: 'start'
            id: 'start'
        },
        {
          data:
            metadata:
              state: 'undone'
              editable: 'false'
              summary: 'end'
            type: 'end'
            id: 'end'
        },
        {
          data:
            metadata:
               script: 'true;'
               performers: [1]
               description: 'desc'
               summary: 'Task id: 1n'
            id: '1n'
            type: 'task'
        },
        {
          data:
            metadata:
              summary: 'State id: 2n'
            id: '2n'
            type: 'stateChange'
        },
        {
          data:
            metadata:
              message: 'Some message to send'
              receivers: 'tst@com.pl'
              summary: 'Notification'
            id: '3n'
            type: 'notification'
        }
      ]
    product =
      workflow: workflow
    productProcessor = new ProductProcessor product

  describe '#getActiveNode', ->
    it 'should return >> 1n << node when active node is not defined', ->
      assert.strictEqual '1n', productProcessor.getActiveNode().data.id

  describe '#process', ->
    it 'should complete processing successfuly', ->
      productProcessor.process()

  describe '#getNodeById', ->
    it 'should return node if object with given id exists in graph nodes collection', ->
      node = productProcessor.getNodeById '1n'
      assert.equal '1n', node.data.id

    it 'should return null if object with given id does not exist in nodes collection', ->
      assert.strictEqual null, productProcessor.getNodeById '99n'

  describe '#getFollowingNode', ->
    it 'should return task node as a follower of start node', ->
      startNode = productProcessor.getNodeById 'start'
      result = productProcessor.getFollowingNode startNode
      assert.equal '1n', result.data.id

    it 'should return not null node as a follower of task node in success case', ->
      taskNode = productProcessor.getNodeById '1n'
      result = productProcessor.getFollowingNode taskNode, 'success'
      assert.notStrictEqual null, result

    it 'should return notification node as a follower of task node in success case', ->
      taskNode = productProcessor.getNodeById '1n'
      result = productProcessor.getFollowingNode taskNode, 'success'
      assert.strictEqual 'notification', result.data.type

    it 'should return not null node as a follower of task node in failure case', ->
      taskNode = productProcessor.getNodeById '1n'
      result = productProcessor.getFollowingNode taskNode, 'failure'
      assert.notStrictEqual null, result

    it 'should return notification node as a follower of task node in success case', ->
      taskNode = productProcessor.getNodeById '1n'
      result = productProcessor.getFollowingNode taskNode, 'failure'
      assert.strictEqual 'stateChange', result.data.type

  describe '#getTasks', ->
    it 'should return array conatining one element', ->
      assert.equal 1, productProcessor.getTasks().length
