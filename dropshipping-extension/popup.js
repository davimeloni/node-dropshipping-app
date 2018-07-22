let bgpage = chrome.extension.getBackgroundPage();
let product = bgpage.productObj;
document.getElementById("productName").innerHTML = "Name: " + product.productName;
document.getElementById("productIds").innerHTML = "Ids: " + product.productId;
document.getElementById("productLink").setAttribute("href", "https:" +  product.productLink);

//document.getElementById("productLink").innerHTML = "Link to: " + product.productName;
