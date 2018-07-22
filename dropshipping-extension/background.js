console.log("background is running");

var http = new XMLHttpRequest();
var url = 'https://7b42e885.ngrok.io/shopify/createproduct';

var productObj;

chrome.runtime.onMessage.addListener(receiver);

function receiver(request, sender, sendResponse) {
    console.log(request);
    productObj = request;
    console.log(productObj);

    /*
    fetch(url, {
        method: "POST",
        body: JSON.stringify(productObj)
    }).then(res => res.text())
    .then(html => console.log(html))
    */
    
    var params = JSON.stringify(productObj);
    console.log(params);
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(params);


}