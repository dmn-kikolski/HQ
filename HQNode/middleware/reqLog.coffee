logger = require '../utils/logger'

reqLog = (request, response, next) ->
  logger.info(request.url)
  logger.info(request.body)
  next()

module.exports = reqLog
