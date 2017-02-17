var _ = require('lodash');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('superagent');
var LineBot = require('line-bot-sdk');

var client = LineBot.client({
    channelID: '1501651709',
    channelSecret: '239ce8176ae2ca2edc3939bcf26241ec',
    channelToken: 'ToDFVvCpNFbfjtxzR2CDLNTt3aSWAhLN2/9jf03d0VGJSqh4DMSJd+fRm4ZH+TfNmzbWt6VCAosZqxsTmvmbIFLh7nQPLztM7/YIIryklIwG65ds9X11voXd8uPXqjabkrgCZYXnzo3dJNwJQwopIQdB04t89/1O/w1cDnyilFU='
});

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({ extended: false, limit: 2 * 1024 * 1024 }));
app.use(bodyParser.json({ limit: 2 * 1024 * 1024 }));

// for line verification
app.post('/', function (req, res) {
    console.log('req.body :', req.body)
    console.log('req.res :', req.res)
    console.log('req.body.res :', req.body.res);
    console.log('<-------- Here! ---------->');

    if (req.body.result) {
        var receives = client.createReceivesFromJSON(req.body);
        _.each(receives, function(receive){
            
            if(receive.isMessage()){

                if(receive.isText()){

                    if(receive.getText()==='me'){
                        client.getUserProfile(receive.getFromMid())
                            .then(function onResult(res){
                                if(res.status === 200){
                                    var contacts = res.body.contacts;
                                    if(contacts.length > 0){
                                        client.sendText(receive.getFromMid(), 'Hi!, you\'re ' + contacts[0].displayName);
                                    }           
                                }
                            }, function onError(err){
                              console.error(err);
                            });
                    } else {
                      client.sendText(receive.getFromMid(), receive.getText());
                    }

                } else if(receive.isImage()) {
                    client.sendText(receive.getFromMid(), 'Thanks for the image!');
                } else if(receive.isVideo()){
                    client.sendText(receive.getFromMid(), 'Thanks for the video!');
                } else if(receive.isAudio()) {
                    client.sendText(receive.getFromMid(), 'Thanks for the audio!');
                }else if(receive.isLocation()){
                    client.sendLocation(
                        receive.getFromMid(),
                        receive.getText() + receive.getAddress(),
                        receive.getLatitude(),
                        receive.getLongitude()
                    );
                } else if(receive.isSticker()) {
                    // This only works if the BOT account have the same sticker too
                    client.sendSticker(
                        receive.getFromMid(),
                        receive.getStkId(),
                        receive.getStkPkgId(),
                        receive.getStkVer()
                    );
                }else if(receive.isContact()){
                    client.sendText(receive.getFromMid(), 'Thanks for the contact');
                }else{
                    console.error('found unknown message type');
                }
            } else if(receive.isOperation()) {
                console.log('found operation');
            } else {

                console.error('invalid receive type');

            }

        });
    }

    res.send(200);
});

app.listen(app.get('port'), function () {
  console.log('Listening on port ' + app.get('port'));
});