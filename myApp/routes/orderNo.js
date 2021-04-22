const express = require('express');
const router = express.Router();

router.get('', function (req, res, next) {
    res.locals.connection.query(`SELECT customerOrderNo, shippingBatchNo FROM supplychain.customer_order`, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

module.exports = router;