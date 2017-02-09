'use strict';
const PAGE_ACCESS_TOKEN = env.PAGE_ACCESS_TOKEN;
const bodyParser = require('body-parser');
const request = require('request');
const botBuilder = require('claudia-bot-builder');
var express = require('express')
var app = express();
var open = require('open');
var dotenv = require('dotenv').load();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Expressheroku l server listening on port %d in %s mode', server.address().port, app.settings.env);
    open('http://127.0.0.1:5000');
});

app.get('/', function (req, res) {
    res.send("Hello from /. ");
})


// page https://www.facebook.com/Comedy-Bot-144000482774878/
// app https://developers.facebook.com/apps/1342241162503801/messenger/
/* For Facebook Validation */
app.get('/messenger_chatbot', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'comedybot') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
      res.send("Hello from 403 status.");
      res.status(403).end();
  }
});

/* Handling all messenges */
app.post('/messenger_chatbot', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
            sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;

    console.log('*** RECEIVED ***');
    console.log(event);

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: {text: text}
        }
    }, function (error, response) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}