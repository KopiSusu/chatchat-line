'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// Process Messages
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.events
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.events[i]
        let sender = event.source.userId
        let replyToken =  event.replyToken
        if (event.message && event.message.text) {
            let text = event.message.text
            replyLineMessage(replyToken, "Text received from line gateway, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

function replyLineMessage(replyToken, text) {
	console.log('text: ', text)

	request
      	.post('https://api.line.me/v2/bot/message/reply')
      	.send({
            replyToken: replyToken,
            messages: [	
            	{
	            	"type":"text",
	            	"text":text
	        	}
	        ]
        })
      	.set('Authorization', `Bearer ${cT}`)
      	.end((err, res) => {
            if (err) {
                console.log('err: ', err)
            } 
      	})
}

const cT = 'ToDFVvCpNFbfjtxzR2CDLNTt3aSWAhLN2/9jf03d0VGJSqh4DMSJd+fRm4ZH+TfNmzbWt6VCAosZqxsTmvmbIFLh7nQPLztM7/YIIryklIwG65ds9X11voXd8uPXqjabkrgCZYXnzo3dJNwJQwopIQdB04t89/1O/w1cDnyilFU='