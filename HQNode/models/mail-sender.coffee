nodemailer = require 'nodemailer'

module.exports =
  class MailSender
    config =
      service: '' #service e.g. GMAIL
      auth:
        user: '' #email address
        pass: '' #password to mail account

    send: (mail) ->
      if isCorrect mail
        smtpTransport = nodemailer.createTransport 'SMTP', config
        smtpTransport.sendMail mail, (error, response) ->
          if error
            console.log('MailSender|send|error: %s',error)
          else
            console.log('MailSender|send|success')
          smtpTransport.close()
      else
        console.log('Mail is incorrect')

    sendNotification: (notification) ->
      data = notification.data.metadata
      mail =
        to: data.receivers
        subject: 'Headquarter notification'
        text: data.message
      smtpTransport = nodemailer.createTransport 'SMTP', config
      smtpTransport.sendMail mail, (error, response) ->
        if error
          console.log('MailSender|send|error: %s',error)
        else
          console.log('MailSender|send|success')
        smtpTransport.close()

    isCorrect = (mail) ->
      return mail?.to? and mail?.text?
