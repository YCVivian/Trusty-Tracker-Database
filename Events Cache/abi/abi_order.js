module.exports = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "salesman",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "customerOrderNo",
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
                "name": "customer",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DoneCustomerOrder",
        "type": "event"
    }
]