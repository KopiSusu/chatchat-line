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
app.post('/line/', function (req, res) {
    let messaging_events = req.body.events
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.events[i]
        let sender = event.source.userId
        let replyToken =  event.replyToken
        if (event.message && event.message.text) {
            let text = event.message.text
            receiveLineMessage(sender, "Text received from line gateway, echo: " + text.substring(0, 200))
            
        }
    }
    res.sendStatus(200)
})
function receiveLineMessage(sender, text) {
    const newMessages = {
        "body": text, 
        "created_on": new Date(), 
        "data": null, 
        "img_src": null, 
        "to": '+19179001106',
        "from": sender + '', 
        "source_type": "line", 
        "tag": null, 
    }
    console.log('sender: ', sender)
    console.log('newMessages: ', newMessages)

    request
        .post(`http://chatchat.api.everybodysay.com:3000/gateway/line/in`)
        .send(newMessages)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err) {
                console.log('some error threw')
            } 
        })
}


app.post('/line/return', function (req, res) {
    console.log('inside /line/return')
    console.log('req.body: ', req.body)

    let sender = req.body.sender_facebook_id;

    while(sender.charAt(0) === '+')
    {
        sender = sender.substring(1, 200)
    }

    console.log('sender: ', sender)
    pushLineMessage(sender, req.body.text.substring(0, 200))

    res.sendStatus(200)
})
function pushLineMessage(sender, text) {
  console.log('text: ', text)

  request
        .post('https://api.line.me/v2/bot/message/push')
        .send({
            to: sender,
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