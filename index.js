'use strict'
const line = require('node-line-bot-api')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// need raw buffer for signature validation
app.use(bodyParser.json({
  verify (req, res, buf) {
    req.rawBody = buf
  }
}))

// init with auth
line.init({
  accessToken: 'ToDFVvCpNFbfjtxzR2CDLNTt3aSWAhLN2/9jf03d0VGJSqh4DMSJd+fRm4ZH+TfNmzbWt6VCAosZqxsTmvmbIFLh7nQPLztM7/YIIryklIwG65ds9X11voXd8uPXqjabkrgCZYXnzo3dJNwJQwopIQdB04t89/1O/w1cDnyilFU=',
  // (Optional) for webhook signature validation
  channelSecret: '239ce8176ae2ca2edc3939bcf26241ec'
})

app.post('/webhook/', line.validator.validateSignature(), (req, res, next) => {
  // get content from request body
  const promises = req.body.events.map(event => {
    // reply message
    console.log(event.message.text)
    return line.client
      .replyMessage({
        replyToken: event.replyToken,
        messages: [
          {
            type: 'text',
            text: event.message.text
          }
        ]
      })
  })

  Promise
    .all(promises)
    .then(() => res.sendStatus({success: true}))
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!')
})
