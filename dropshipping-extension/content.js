console.log("Chrome Extension content script");

let url = new URL(window.location.href);
console.log('log');
console.log(url.searchParams.get('objectId'));

/* Fill Aliexpress Fullfilment Information */

window.onload = function () {
    /*$('.sa-country option').each(function(){
        $(this).removeAttr('selected');
    });

    $('.sa-country option').each(function(){
        if($(this).html() == "AU")
            $(this).attr('selected','selected')
    });*/

    document.getElementsByName("country")[0].value = url.searchParams.get('country'); 
    console.log(url.searchParams.get('country'));
    //$('.sa-country option[value=' + url.searchParams.get('country') + ']').attr('selected','selected').change();
  
    document.getElementsByName("contactPerson")[0].value = url.searchParams.get('contactName');   
    document.getElementsByName("address")[0].value = url.searchParams.get('address1');
    document.getElementsByName("address2")[0].value = url.searchParams.get('address2');
    document.getElementsByName("city")[0].value = "Brisbane" // url.searchParams.get('city');
    document.getElementsByName("zip")[0].value = url.searchParams.get('zip');
    document.getElementsByName("mobileNo")[0].value = url.searchParams.get('mobile');

    var state = document.getElementsByClassName("ui-textfield-system")[5];

    $(state).append($('<option>', {
        value: "Queensland",
        text: "Queensland"
    }).attr('selected', 'selected'));

    if (document.getElementsByName("country")[0].value == "AU") {
        document.getElementsByName("phoneCountry")[0].value = '+61';
    }
}

/* End Fill Aliexpress Fullfilment Information */


var atc_product_ids = document.getElementsByClassName("atc-product-id");

/* Begin Aliexpress-Shopify-Neto Dropshipping Button */
for (let i = 0; i < atc_product_ids.length; i++) {
    let shopifyButton = document.createElement("button");
    let shopifyText = document.createTextNode("Dropship to Shopify");
    let netoButton = document.createElement("button");
    let netoText = document.createTextNode("Dropship to Neto");
    
    shopifyButton.appendChild(shopifyText);
    shopifyButton.addEventListener("click", function() {
        let shopifyId = this.parentNode.getElementsByClassName("atc-product-id")[0].value;
        let shopifyTitle = this.parentNode.parentNode.getElementsByClassName("product")[0].getAttribute("title");
        let shopifyLink = this.parentNode.parentNode.getElementsByClassName("product")[0].getAttribute("href");
        console.log("Shopify: " + shopifyTitle);

        chrome.runtime.sendMessage("Shopify");
    });

    netoButton.appendChild(netoText);
    netoButton.addEventListener("click", function() {
        let netoId = this.parentNode.getElementsByClassName("atc-product-id")[0].value;
        let netoTitle = this.parentNode.parentNode.getElementsByClassName("product")[0].getAttribute("title");
        let netoLink = this.parentNode.parentNode.getElementsByClassName("product")[0].getAttribute("href");
        console.log("Neto: " + netoId);

        let netoProduct = {
            "Item": {
                "SKU": netoId,
                "Name": netoTitle
            }
        }

        chrome.runtime.sendMessage({'id': netoId});

    });


    atc_product_ids[i].parentNode.appendChild(shopifyButton);
    atc_product_ids[i].parentNode.appendChild(netoButton);

}
/* End Aliexpress-Shopify Dropshipping Button */


//var scripts = document.getElementById("bd-inner").getElementsByTagName("script")[0].innerHTML;
//var testSkuInfo = JSON.parse(scripts);
//console.log(testSkuInfo);

