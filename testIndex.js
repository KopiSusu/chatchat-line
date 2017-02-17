'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
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
            replyLineMessage(replyToken, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

function sendLineMessage(replyToken, text) {
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
      // .set('Accept', 'application/json')
      	.end((err, res) => {
        	if (err) { return reject(err) }
        	return resolve(res.body)
      	})
}


function replyLineMessage(replyToken, text) {
	console.log('text: ', text)

    request({
        url: 'https://api.line.me/v2/bot/message/reply',
        Authorization: {Bearer: cT},
        method: 'POST',
        body: JSON.stringify({
            replyToken: replyToken,
            messages: [
            	{
	            	"type":"text",
	            	"text":text
	        	}
	        ]
        })
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

const cId = '1501651709'
const cS = '239ce8176ae2ca2edc3939bcf26241ec'
const cT = 'ToDFVvCpNFbfjtxzR2CDLNTt3aSWAhLN2/9jf03d0VGJSqh4DMSJd+fRm4ZH+TfNmzbWt6VCAosZqxsTmvmbIFLh7nQPLztM7/YIIryklIwG65ds9X11voXd8uPXqjabkrgCZYXnzo3dJNwJQwopIQdB04t89/1O/w1cDnyilFU='
