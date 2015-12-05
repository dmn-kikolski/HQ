winston = require 'winston'
winston.emitErrs = true

fileLoggerProperties =
  level: 'info'
  filename: './hq-logs.log'
  handleExceptions: true
  json: false
  maxsize: 5242880
  maxfiles: 5,
  colorize: false

consoleLoggerProperties =
  level: 'debug'
  handleExceptions: true
  json: true
  colorize: true

logger = new winston.Logger({
  transports: [new winston.transports.File fileLoggerProperties, new winston.transports.Console consoleLoggerProperties]
  exitOnError: false
})

module.exports = logger
