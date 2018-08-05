var express = require('express');
var router = express.Router();
require('dotenv').config();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
var request = require('request-promise');
const forwardingAddress = "https://b560fad2.ngrok.io";

const aliexpressScrapper = require('aliexpress-scrapper');

const netoSettings = require('../config/neto-settings');

var accessToken;
var netoAPI = 'https://davidd.neto.com.au/do/WS/NetoAPI';

router.get('/', function(req, res, next) {
  console.log(netoAPI);
  res.send("Neto is ON!");
});

router.get('/app/orders', function(req, res, next) {

  console.log('getting orders');
  let ordersFilter;
  console.log(netoSettings.getOrdersBody);

  let options = {
    method: 'POST',
    uri: netoAPI,
    body: netoSettings.getOrdersBody, 
    json: true,
    headers: netoSettings.getOrdersHeaders
};


request(options)
    .then(function (parsedBody) {
        console.log(parsedBody);
        res.status(200).json(parsedBody);
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).send('bad');
    });

});

router.put('/app/dispatchorder', function(req, res, next) {

    console.log('getting orders');
    let ordersFilter;
    console.log(req.body);
  
    let options = {
      method: 'POST',
      uri: netoAPI,
      body: req.body, 
      json: true,
      headers: netoSettings.updateOrderHeaders
  };
  
  request(options)
      .then(function (parsedBody) {
          console.log(parsedBody);
          res.status(200).json(parsedBody);
      })
      .catch(function (err) {
          console.log(err);
          res.status(500).send('bad');
      });
  
  });


router.post('/app/createproduct', function(req, res, next) {

    let url = 'https://' + shopDomain + '/admin/products.json';
    console.log(req.body);
    let product = req.body;
    //console.log(JSON.parse(req.body).toString());
    
    
    let options = {
        method: 'POST',
        uri: url,
        json: true,
        body: product,
        headers: {
           'X-Shopify-Access-Token': accessToken,
            'content-type': 'application/json'
        }
    };

    request(options)
        .then(function (parsedBody) {
            console.log(parsedBody);
            res.status(200).send('good');
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send('bad');
        });
        

});

router.post('/app/test', function(req, res, next) {

    console.log('reaching here?');
    console.log(req.body);
    
    
    aliexpressScrapper(req.body.id) // 32853590425 is a productId
    .then((response) => {
        let x = JSON.parse(response);
        //console.log(x);

        let vt;
        let vot;

        x.variants.filter(variant => {
            console.log(variant);
            variant.options.some(option => option.optionId == "14:193")
        }).map((variant) => {
            vt = variant.title;
            vot = option.title;
        });

        console.log("variant test " + vt + vot);

        console.log(x.pics[0]);
        let product = {
                "Item": {
                    "SKU": x.productId,
                    "Name": x.productTitle,
                    "Active": true,
                    "Visible": true,
                    "Approved": true,
                    "Images": {
                        "Image": [ {
                        "Name": "Main",
                        "URL": x.pics[0]
                        } ],
                    "Image": [ {
                        "Name": "Alt",
                        "URL": x.pics[1]
                        } ],
                    }
                }
            }

        let options = {
            method: 'POST',
            uri: netoAPI,
            body: product, 
            json: true,
            headers: netoSettings.addItemHeaders
        }
    
        /*
        request(options)
        .then(function (parsedBody) {
            console.log(parsedBody);
            res.status(200).send(parsedBody);
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send('bad');
        });
        */
        res.send(x);

    })
    .catch(error => console.log(error));
    
});



module.exports = router;