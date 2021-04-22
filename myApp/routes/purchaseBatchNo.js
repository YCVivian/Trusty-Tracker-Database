const express = require('express');
const router = express.Router();

router.get('', function (req, res, next) {
    res.locals.connection.query(`SELECT purchaseBatchNo FROM supplychain.product_purchase`, function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify(results));
    });
});

module.exports = router;