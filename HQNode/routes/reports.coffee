log = require '../utils/logger'
express = require 'express'
mongoose = require 'mongoose'
csv = require 'express-csv'
Product = require '../models/product'
router = express.Router()

getReportForProducts = (request, response) ->
  format = request.body.format
  Product.find {}, (error, products) ->
    if error then response.sendStatus 500
    else
      productsArray = []
      if format is 'CSV'
        for product in products
          productsArray.push product.reportArray()
        response.csv productsArray
      else if format is 'JSON'
        for product in products
          productsArray.push product.reportJson()
        response.json productsArray
      else
        response.format
          text: ->
            output = ''
            for product in products
              output = output + product.reportTxt(request.body.divider)
            response.send output

getUndoneProducts = (request, response) ->
  format = request.body.format
  criteria =
     state =
       $ne: 'done'
  Product.find {criteria}, (error, products) ->
    if error then response.sendStatus 500
    else
      productsArray = []
      if format is 'CSV'
        for product in products
          productsArray.push product.reportArray()
        if productsArray.length isnt 0
          response.csv productsArray
        else
          response.sendStatus 404
      else if format is 'JSON'
        for product in products
          productsArray.push product.reportJson()
        if productsArray.length isnt 0
          response.json productsArray
        else
          response.sendStatus 404
      else
        response.format
          text: ->
            output = ''
            for product in products
              output = output + product.reportTxt(request.body.divider)
            if output.length is 0
              response.sendStatus 404
            else
              response.send output

getFinishedProducts = (request, response) ->
  format = request.body.format
  criteria =
    state: 'done'
  Product.find {criteria}, (error, products) ->
    if error then response.sendStatus 500
    else
      productsArray = []
      if format is 'CSV'
        for product in products
          productsArray.push product.reportArray()
        if productsArray.length isnt 0
          response.csv productsArray
        else
          response.sendStatus 404
      else if format is 'JSON'
        for product in products
          productsArray.push product.reportJson()
        if productsArray.length isnt 0
          response.json productsArray
        else
          response.sendStatus 404
      else
        response.format
          text: ->
            output = ''
            for product in products
              output = output + product.reportTxt(request.body.divider)
            if output.length is 0
              response.sendStatus 404
            else
              response.send output

router.post '/products', getReportForProducts
router.post '/products/undone', getUndoneProducts
router.post '/products/done', getFinishedProducts

module.exports = router
