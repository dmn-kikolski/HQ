mongoose = require 'mongoose'

Schema = mongoose.Schema

WorkflowSchema = new Schema
  name:
    type: String,
  description:
    required: true,
    type: String
  isWorkingCopy:
    type: Boolean
  isTemplate:
    type: Boolean
  creator:
    id:
      type: String
      required: true
    name:
      type: String
      required: true
  editor:
    id:
      type: String
      required: true
    name:
      type: String
      required: true
  creationDate:
    type: Date,
    default: Date.now
  editionDate:
    type: Date,
    default: Date.now
  graph:
    nodes:
      type: Array
    edges:
      type: Array

module.exports = mongoose.model 'Workflow', WorkflowSchema
