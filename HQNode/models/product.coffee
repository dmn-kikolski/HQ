mongoose = require 'mongoose'

Schema = mongoose.Schema

ProductSchema = new Schema
  name:
    type: String
    requred: true
  description:
    type: String
    default: ''
  creator:
    id:
      type: String
      required: true
    name:
      type: String
      required: true
  creationDate:
    type: Date
    default: Date.now
  state:
    type: String
    default: 'pending'
  workflow:
    nodes:
      type: Array
      requred: true
    edges:
      type: Array
      requred: true
    activeNode:
      type: mongoose.Schema.Types.Mixed

ProductSchema.methods.reportRecord = ->
  return this.name + '|' + this.state + '|' + this.creationDate + '|' + this.creator.name + '|' + this.description + '\n'

ProductSchema.methods.reportArray = ->
  return [this.name, this.state, this.creator.name, this.description];

ProductSchema.methods.reportJson = ->
  output =
    name: this.name
    state: this.state
    creatorName: this.creator.name
    description: this.description
  return output

ProductSchema.methods.reportTxt = (divider) ->
  return this.name + divider + this.state + divider + this.creator.name + divider + this.description + '\n'

ProductSchema.methods.getWorkflow = ->
  return JSON.parse(JSON.stringify(this.workflow))

module.exports = mongoose.model 'Product', ProductSchema
