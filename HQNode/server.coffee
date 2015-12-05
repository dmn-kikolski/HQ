express = require 'express'
mongoose = require 'mongoose'
bodyParser = require 'body-parser'
cookieParser = require 'cookie-parser'
jsonWebToken = require 'jsonwebtoken'
cors = require 'cors'
log = require './utils/logger'
reqLog = require './middleware/reqLog'

usersRoutes = require './routes/users'
workflowRoutes = require './routes/workflows'
authorizationRoutes = require './routes/authorization'
productsRoutes = require './routes/products'
tasksRoutes = require './routes/tasks'
reportsRoutes = require './routes/reports'


server = express()

server.set 'secret', 'supersecret'

server.use cookieParser()
server.use bodyParser.json()
server.use cors()
server.use reqLog
server.use '/users', usersRoutes
server.use '/workflows', workflowRoutes
server.use '/authorization', authorizationRoutes
server.use '/products', productsRoutes
server.use '/tasks', tasksRoutes
server.use '/reports', reportsRoutes

mongoose.connect('mongodb://localhost/hq')

server.listen 3000, ->
  console.log('Server is listening on port 3000')
  log.info('server started')
