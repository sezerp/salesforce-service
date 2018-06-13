const express = require('express');
const jsforce = require('jsforce');
const url = require('url');
var bodyParser = require('body-parser');

const __SERVER_PORT = '3000';

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log('req');
    res.send({name: 'Paweł'});
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  
app.post('/salesforceservice', (req, res) => {
    var password = req.body.password;
    var username = req.body.username;

    var conn = new jsforce.Connection();
    var token;
    conn.login(username, password, (err, response) => {
        if (err) { 
            res.send(err);
            return; }
            token = conn.accessToken;
        
    }).
    then((response) => {

        conn.describeGlobal(function(err, response) {
            if (err) { return console.error(err); }
            console.log('Num of SObjects : ' + response.sobjects.length);
            response.accessToken = token;
            res.send(response);
          });

    }, (error) => {
        res.send(error);
    });
});

app.post('/salesforceservice/describe', (req, res) => {
    var password = req.body.password;
    var username = req.body.username;
    var sObjectName = req.body.sobjectName;
    var token;
    var conn = new jsforce.Connection();

    conn.login(username, password, (err, response) => {
        if (err) { 
            res.send(err);
            return console.log(err); }

        token = conn.accessToken;
        
    }).
    then((response) => {
        sobject("Account").describe(function(err, meta) {
            if (err) { 
                res.send(err);
                return console.error(err); }
            console.log('Label : ' + meta.label);
            console.log('Num of Fields : ' + meta.fields.length);
            meta.accessToken = token;
            res.send(meta);
          });
        }, (error) => {
            res.send(err);
            } 
    );
})


app.listen(__SERVER_PORT, ()=> {
    console.log(`Server started at ${__SERVER_PORT} port.`);
});