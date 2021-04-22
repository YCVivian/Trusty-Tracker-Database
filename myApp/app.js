const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');
var cors = require('cors');

const batchInfoRouter = require('./routes/batchInfo');
const purchaseBatchNoRouter = require('./routes/purchaseBatchNo');
const orderNoRouter = require('./routes/orderNo');

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://master.d3mfjl7d3xxj06.amplifyapp.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.set('port', process.env.port || 4000);

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '0328',
        database: 'supplychain'
    });
    res.locals.connection.connect();
    next();
});

app.use('/batchInfo', batchInfoRouter);
app.use('/purchaseBatchNo', purchaseBatchNoRouter);
app.use('/orderNo', orderNoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// app.listen(app.get('port'), function () {
//     console.log('Express started on http://localhost:' + app.get('port') + '.')
// });

module.exports = app;