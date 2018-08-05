console.log("background is running");

var http = new XMLHttpRequest();
var shopifyUrl = 'https://d4c16b85.ngrok.io/shopify/app/createproduct';
//var netoUrl = 'https://davidd.neto.com.au/do/WS/NetoAPI';
var netoUrl = 'https://b560fad2.ngrok.io/neto/app/test';

var productObj;

chrome.runtime.onMessage.addListener(receiver);

function receiver(request, sender, sendResponse) {
    console.log(request);
    //productObj = request;
    //console.log(productObj);
    
    
    var params = request;
    //console.log(params);
    http.open('POST', netoUrl, true);

    /*Send the proper header information along with the request
    http.setRequestHeader('NETOAPI_KEY', 'P1ruRY5goTj56ytsWBpnXsJhJcxszcn7');
    http.setRequestHeader('NETOAPI_USERNAME', 'apiguy');
    http.setRequestHeader('NETOAPI_ACTION', 'AddItem');
    http.setRequestHeader('Accept', 'application/json');
    http.setRequestHeader('Content-type', 'application/json');
    */

   //Send the proper header information along with the request
   http.setRequestHeader('Content-type', 'application/json');
   
   http.onreadystatechange = function() {//Call a function when the state changes.
       if(http.readyState == 4 && http.status == 200) {
           alert(http.responseText);
       }
   }
   http.send(params);
    

}