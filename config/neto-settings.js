const api = {
    "getOrdersHeaders": {
        "NETOAPI_KEY": "P1ruRY5goTj56ytsWBpnXsJhJcxszcn7",
        "NETOAPI_USERNAME": "apiguy",
        "NETOAPI_ACTION": "GetOrder",
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    "getOrdersBody": {
        "Filter": {
            "OrderStatus": [
                "New",
                "Pick",
                "Pack"
            ],
            "OutputSelector": [
                "ShippingOption",
                "DeliveryInstruction",
                "Username",
                "Email",
                "ShipAddress",
                "BillAddress",
                "CustomerRef1",
                "CustomerRef2",
                "CustomerRef3",
                "CustomerRef4",
                "SalesChannel",
                "GrandTotal",
                "ShippingTotal",
                "ShippingDiscount",
                "OrderType",
                "OrderStatus",
                "OrderPayment",
                "OrderPayment.PaymentType",
                "OrderPayment.DatePaid",
                "DatePlaced",
                "DateRequired",
                "DateInvoiced",
                "DatePaid",
                "OrderLine",
                "OrderLine.ProductName",
                "OrderLine.PickQuantity",
                "OrderLine.BackorderQuantity",
                "OrderLine.UnitPrice",
                "OrderLine.WarehouseID",
                "OrderLine.WarehouseName",
                "OrderLine.WarehouseReference",
                "OrderLine.Quantity",
                "OrderLine.PercentDiscount",
                "OrderLine.ProductDiscount",
                "OrderLine.CostPrice",
                "OrderLine.ShippingMethod",
                "OrderLine.ShippingTracking",
                "ShippingSignature",
                "eBay.eBayUsername",
                "eBay.eBayStoreName",
                "OrderLine.eBay.eBayTransactionID",
                "OrderLine.eBay.eBayAuctionID",
                "OrderLine.eBay.ListingType",
                "OrderLine.eBay.DateCreated",
                "OrderLine.eBay.DatePaid"
            ]
        }
    },
    "updateOrderHeaders": {
        "NETOAPI_KEY": "P1ruRY5goTj56ytsWBpnXsJhJcxszcn7",
        "NETOAPI_USERNAME": "apiguy",
        "NETOAPI_ACTION": "UpdateOrder",
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
    "addItemHeaders": {
        "NETOAPI_KEY": "P1ruRY5goTj56ytsWBpnXsJhJcxszcn7",
        "NETOAPI_USERNAME": "apiguy",
        "NETOAPI_ACTION": "AddItem",
        "Accept": "application/json",
        "Content-Type": "application/json"
    },
};

module.exports = api;