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

router.get('/', function (req, res, next) {
    console.log(netoAPI);
    res.send("Neto is ON!");
});

router.get('/app/orders', function (req, res, next) {

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

router.put('/app/dispatchorder', function (req, res, next) {

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


router.post('/app/createproduct', function (req, res, next) {

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

router.post('/app/test', function (req, res, next) {

    console.log('reaching here?');
    console.log(req.body);


    aliexpressScrapper(req.body.id) // 32853590425 is a productId
        .then((response) => {
            let x = JSON.parse(response);
            //console.log(x);

            // initialize array of images
            let images = [];

            for (i = 0; i < x.pics.length; i++) {
                //initialize image to push
                let image = {
                    "Name": "",
                    "URL": ""
                };

                if (i == 0) {
                    image.Name = "Main";
                } else {
                    image.Name = "Alt " + i;
                }
                image.URL = x.pics[i];
                images.push(image);

            }

            // If products has variants, then create an array of products
            if (x.variants.length > 0) {

                console.log(x.productTitle);

                // Initialize the array of products that will be persisted
                let variationProducts = [];
                //initialize the parent product
                let baseProduct = {
                    "SKU": "ALI" + x.productId,
                    "Name": x.productTitle,
                    "Active": true,
                    "Visible": true,
                    "Approved": true,
                    "ItemSpecifics": { "ItemSpecific": [] },
                    "Images": { "Image": images },
                    "IsInventoried": false,
                    "CostPrice": x.pricing[0].singlePricing,
                    "DefaultPrice": x.pricing[0].singlePricing * 1.3,
                    "Description": x.description,
                    "WarehouseQuantity": [{
                        "WarehouseID": 1,
                        "Quantity": 9999,
                    }],
                    "Categories": {
                        "Category": [{
                            "CategoryID": 105
                        }]
                    }
                };


                // add the parent product
                variationProducts.push(baseProduct);

                x.pricing.forEach(price => {
                    let productToAdd =
                    {
                        "SKU": "",
                        "ParentSKU": baseProduct.SKU,
                        "Name": x.productTitle,
                        "Active": true,
                        "Visible": true,
                        "Approved": true,
                        "ItemSpecifics": { "ItemSpecific": [] },
                        "Images": { "Image": images },
                        "IsInventoried": false,
                        "CostPrice": price.singlePricing,
                        "DefaultPrice": price.singlePricing * 1.3,
                        "Description": x.description,
                        "WarehouseQuantity": [{
                            "WarehouseID": 1,
                            "Quantity": 9999,
                        }],
                        "Categories": {
                            "Category": [{
                                "CategoryID": 105
                            }]
                        }
                    };

                    let netoSpecifics = [];
                    let skuAttr = "_";

                    price.combinedOptions.forEach(combinedOption => {
                        let netoSpecific = {
                            "Name": "",
                            "Value": ""
                        };
                        // Find Variant Title and Option Title, maybe pic;
                        x.variants.find(variant =>
                            variant.options.some((option) => {
                                if (option.optionId === combinedOption) {
                                    netoSpecific.Name = variant.title
                                    if (option.title) {
                                        netoSpecific.Value = option.title;
                                        skuAttr = skuAttr + option.title.substring(0, 3) + "-";
                                    } else if (option.text) {
                                        netoSpecific.Value = option.text;
                                        skuAttr = skuAttr + option.text.substring(0, 3) + "-";

                                    }
                                    netoSpecifics.push(netoSpecific);
                                }
                            })
                        );
                    });
                    productToAdd.ItemSpecifics.ItemSpecific = netoSpecifics;
                    productToAdd.SKU = baseProduct.SKU + skuAttr.substring(0, skuAttr.length - 1);
                    variationProducts.push(productToAdd);

                });

                let dataToSend = {
                    "Item": variationProducts
                }


                let options = {
                    method: 'POST',
                    uri: netoAPI,
                    body: dataToSend,
                    json: true,
                    headers: netoSettings.addItemHeaders
                }


                request(options)
                    .then(function (parsedBody) {
                        console.log(parsedBody);
                        res.status(200).send(parsedBody);
                    })
                    .catch(function (err) {
                        console.log(err);
                        res.status(500).send('bad');
                    });

                // res.send(dataToSend);
            }

            /*
            let options = {
                method: 'POST',
                uri: netoAPI,
                body: product,
                json: true,
                headers: netoSettings.addItemHeaders
            }

            
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
            //res.send(variationProducts);

        })
        .catch(error => console.log(error));

});



module.exports = router;