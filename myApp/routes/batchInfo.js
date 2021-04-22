const express = require('express');
const router = express.Router();

router.get('/:address', function (req, res, next) {
    res.locals.connection.query(`SELECT product_purchase.id, product_purchase.purchaseBatchNo, product_purchase.goodsInfo, 
                                product_purchase.farmerName, product_purchase.farmLocation, farmer.fullName, farmer.farmName,
                                employee.fullName, customer.symbol,
                                product_warehouse.shelfNo, shipping.driver, shipping.truckNo, shipping.destination, 
                                FROM_UNIXTIME(product_purchase.deliveryDateTime, \'%Y-%m-%d %H:%i:%s\') AS deliveryDateTime, 
                                FROM_UNIXTIME(product_inspection.inspectionDateTime, \'%Y-%m-%d %H:%i:%s\') AS inspectionDateTime,
                                FROM_UNIXTIME(product_warehouse.stackDateTime, \'%Y-%m-%d %H:%i:%s\') AS stackDateTime,
                                FROM_UNIXTIME(shipping.shippingDateTime, \'%Y-%m-%d %H:%i:%s\') AS shippingDateTime,
                                FROM_UNIXTIME(customer_consignment.consignmentDateTime, \'%Y-%m-%d %H:%i:%s\') AS consignmentDateTime
                                FROM supplychain.product_purchase, supplychain.product_inspection, supplychain.product_warehouse, 
                                supplychain.shippingbatch, supplychain.shipping, supplychain.customer_consignment, supplychain.farmer,
                                supplychain.employee, supplychain.customer
                                WHERE product_purchase.purchaseBatchNo = shippingbatch.purchaseBatchNo
                                AND product_purchase.farmer = farmer.address_MetaMask
                                AND product_inspection.purchaseBatchNo = shippingbatch.purchaseBatchNo
                                AND product_inspection.inspector = employee.address_MetaMask
                                AND product_warehouse.purchaseBatchNo = shippingbatch.purchaseBatchNo
                                AND shipping.shippingBatchNo = shippingbatch.shippingBatchNo
                                AND customer_consignment.shippingBatchNo = shippingbatch.shippingBatchNo
                                AND customer_consignment.customer = customer.address_MetaMask
                                AND shippingbatch.shippingBatchNo = \'${req.params.address}\'`, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

module.exports = router;