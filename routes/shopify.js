var express = require('express');
var router = express.Router();
require('dotenv').config();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
var request = require('request-promise');
const forwardingAddress = "https://82e2997c.ngrok.io";

var apiKey = process.env.SHOPIFY_API_KEY;
var apiSecret = process.env.SHOPIFY_API_SECRET;
var scopes = 'write_products,read_orders';
var accessToken;
var shopDomain;

router.get('/install', (req, res) => {
    console.log(apiKey);
    const shop = req.query.shop;
    shopDomain = req.query.shop;
    if (shop) {
      const state = nonce();
      const redirectUri = forwardingAddress + '/shopify/callback';
      const installUrl = 'https://' + shop +
        '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes +
        '&state=' + state +
        '&redirect_uri=' + redirectUri;
  
      res.cookie('state', state);
      res.redirect(installUrl);
    } else {
      return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
  });

router.get('/callback', (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
  
    if (state !== stateCookie) {
      return res.status(403).send('Request origin cannot be verified');
    }
  
    if (shop && hmac && code) {
      // DONE: Validate request is from Shopify
      const map = Object.assign({}, req.query);
      delete map['signature'];
      delete map['hmac'];
      const message = querystring.stringify(map);
      const providedHmac = Buffer.from(hmac, 'utf-8');
      const generatedHash = Buffer.from(
        crypto
          .createHmac('sha256', apiSecret)
          .update(message)
          .digest('hex'),
          'utf-8'
        );
      let hashEquals = false;
  
      try {
        hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
      } catch (e) {
        hashEquals = false;
      };
  
      if (!hashEquals) {
        return res.status(400).send('HMAC validation failed');
      }
  
      // DONE: Exchange temporary code for a permanent access token
      const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
      const accessTokenPayload = {
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      };
  
      request.post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then((accessTokenResponse) => {
        accessToken = accessTokenResponse.access_token;
        // DONE: Use access token to make API call to 'shop' endpoint
        const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
        const shopRequestHeaders = {
          'X-Shopify-Access-Token': accessToken,
        };

        request.get(shopRequestUrl, { headers: shopRequestHeaders })
        .then((shopResponse) => {
          res.status(200).end(shopResponse);
        })
        .catch((error) => {
          res.status(error.statusCode).send(error.error_description);
        });
      })
      .catch((error) => {
        res.status(error.statusCode).send(error.error_description);
      });
  
    } else {
      res.status(400).send('Required parameters missing');
    }
  });

router.get('/app', function (req, res, next) {
    res.render('app', { title: 'Donohue Test App' });
    if (accessToken) {
      res.json(accessToken);
    }
});

router.get('/app/products', function (req, res, next) {


    console.log("access token: " + accessToken)

    let url = 'https://' + shopDomain + '/admin/products.json';

    let options = {
        method: 'GET',
        uri: url,
        json: true,
        headers: {
           'X-Shopify-Access-Token': accessToken,
            'content-type': 'application/json'
        }
    };

    request(options)
        .then(function (parsedBody) {
            console.log(parsedBody);
            res.status(200);
            let options = {
              method: 'GET',
              uri: url,
              json: true,
              headers: {
                 'X-Shopify-Access-Token': accessToken,
                  'content-type': 'application/json'
              }
          };
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

router.get('/app/orders', function(req, res, next) {

  console.log(req.query.id);
  var orderId = req.query.id;
  var order;

  let orderUrl = 'https://' + shopDomain + '/admin/orders.json';

  let options = {
    method: 'GET',
    uri: orderUrl,
    json: true,
    headers: {
       'X-Shopify-Access-Token': accessToken,
        'content-type': 'application/json'
    }
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



module.exports = router;