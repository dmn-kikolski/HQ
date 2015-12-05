assert = require 'assert'
MailSender = require '../models/mail-sender'

describe 'mailSender', ->
  mailer = null

  before ->
    mailer = new MailSender

  # describe '#send', ->
  #  it 'should return true when mail is filled correcly', ->
  #    mail =
  #      to: 'damian.kikolski@gmail.com'
  #      text: 'Processing complteted successfuly'
  #      subject: 'Test'
  #    mailer.send mail

    # it 'should return false when email is empty', ->
    #   mail =
    #     text: 'Processing complteted successfuly'
    #   assert.equal false, mailer.send mail
    #
    # it 'should return false when text is empty', ->
    #   mail =
    #     email: 'damkik@com.pl'
    #   assert.equal false, mailer.send mail
    #
    # it 'should return false when email object is null', ->
    #   assert.equal false, mailer.send null
