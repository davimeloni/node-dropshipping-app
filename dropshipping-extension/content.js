console.log("Chrome Extension content script");

/*
window.addEventListener('mouseup', wordSelected);

document.addEventListener("mousedown", function(event){
    var el = event.target;
    console.log("Clicked element:", el, el.nodeName, el.id);
}, true); 
*/

var buttonOnSite = document.getElementsByClassName("item");

for (var i = 0; i < buttonOnSite.length; i++) {
    var buttonx = document.createElement("button");
    var textx = document.createTextNode("Add item");
    buttonx.appendChild(textx);
    //qrdata = buttonOnSite[i].parentNode.getAttribute("qrdata");
    
    buttonx.addEventListener("click", function() {
        var buttonqrdata = this.parentNode.parentNode.getAttribute("qrdata");
        var productTitle = this.parentNode.getElementsByClassName("product")[0].getAttribute("title");
        var productLink = this.parentNode.getElementsByClassName("product")[0].getAttribute("href");

        console.log("button clicked");
        console.log("Data that will look for info about the product: " + buttonqrdata);
        console.log(productTitle);
        console.log(productLink);
        var message = {
            "product": {
                "title": productTitle,
                "vendor": "Aliexpress",
                "product_type": "Clothing"
            }
        }
        chrome.runtime.sendMessage(message);
    });
    buttonOnSite[i].appendChild(buttonx);
}

function wordSelected() {
    let selectedText;
    selectedText = window.getSelection().toString().trim();
    console.log(selectedText);
    if (selectedText.length > 0) {
        let message = {
            text: selectedText
        }
        chrome.runtime.sendMessage(message);
    }
}

