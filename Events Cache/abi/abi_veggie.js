module.exports = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "farmer",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "purchaseBatchNo",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "goodsInfo",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "quantity",
                "type": "uint8"
            },
            {
                "indexed": false,
                "name": "farmerName",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "farmLocation",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DonePurchaseBatch",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "unloader",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "purchaseBatchNo",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "quantity",
                "type": "uint8"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DonePurchase",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "inspector",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "purchaseBatchNo",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "memoReturn",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "quantityReturn",
                "type": "uint8"
            },
            {
                "indexed": false,
                "name": "quantity",
                "type": "uint8"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DoneInspection",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "warehouseOfficer",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "purchaseBatchNo",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "shelfNo",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "quantity",
                "type": "uint8"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DoneWarehouse",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "warehouseOfficer",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "shippingBatchNo",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "customerOrderNo",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "purchaseBatchNo",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "quantity",
                "type": "uint8"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DoneShippingBatch",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "deliveryOfficer",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "shippingBatchNo",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "quantity",
                "type": "uint8"
            },
            {
                "indexed": false,
                "name": "driver",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "truckNo",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "destination",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DoneShipping",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "customer",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "shippingBatchNo",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "orderNo",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "goodsInfo",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "quantity",
                "type": "uint8"
            },
            {
                "indexed": false,
                "name": "defectiveQuantity",
                "type": "uint8"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DoneConsignment",
        "type": "event"
    }
]