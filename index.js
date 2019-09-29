const express = require('express');
const expHandler = require('express-handlebars');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Request = require('request');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', expHandler());
app.set('view engine', 'handlebars');

const key = '<your-iexapis-key>';

function callAPI(callFinished, stockTicker) {
  const url = `https://cloud.iexapis.com/stable/stock/${stockTicker}/quote?token=${key}`;
  Request(url, { json: true }, (err, res, body) => {
    if (err) {
      return console.log(err)
    }
    if (res.statusCode === 200) {
      callFinished(body);
    }
  })
}

function fetchData(res, stockTicker = 'TSLA') {
  callAPI((data) => {
    res.render('home', {
      stock: data
    });
  }, stockTicker);
}

app.get('/', function (req, res) {
  fetchData(res);
});

app.post('/', function (req, res) {
  const stockTicker = req.body.search_text || 'TSLA';
  fetchData(res, stockTicker);
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("Aloha! The server is up. Click below to go to home: ");
  console.info("http://localhost:5000");
});