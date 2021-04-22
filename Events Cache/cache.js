const mysql = require('mysql');
const util = require('util');
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');
const veggieAbi = require('./abi/abi_veggie.js');
const orderAbi = require('./abi/abi_order.js');

//Insert your contract address here
const veggieAddress = '0xc0550A0ea14CAa24cc683ebbd99baE897f6d771C';
const orderAddress = '0xd77dE2053781ff943Cc1838D65E0fE6a64B9a5Cb';

let veggie = new web3.eth.Contract(veggieAbi, veggieAddress);
let order = new web3.eth.Contract(orderAbi, orderAddress);

const timeout = 10;

//---------------------------------------------------------------------------------------
// utilities

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function poll(fn) {
    await fn();
    await sleep(timeout * 1000);
    await poll(fn);
}

//---------------------------------------------------------------------------------------
// creating connection pool - insert your credentials 
let pool = mysql.createPool({
    connectionLimit: 30,
    host: 'localhost',
    user: 'root',
    password: '0328',
    database: 'supplychain'
})

//it would be convenient to use promisified version of 'query' methods
pool.query = util.promisify(pool.query);
//---------------------------------------------------------------------------------------

// async function selectTransfersFrom(sender) {
//     return await pool.query(`select json from transfer t where t.from = \'${sender}\'`);
// }

//-------------------------------------------------------------------------------------------------

async function cacheEventsI(latestCachedBlock, latestEthBlock) {
    let events = await veggie.getPastEvents(
        "DonePurchaseBatch",
        { filter: {}, fromBlock: latestCachedBlock, toBlock: latestEthBlock }
    );
    console.log(events);

    for (let event of events) {
        await writeEventI(event);
    }
}

async function writeEventI(event) {
    try {
        delete event.blockHash;
        delete event.removed;
        delete event.id;
        delete event.event;
        delete event.signature;
        delete event.raw;

        let result = JSON.parse(JSON.stringify(event.returnValues));

        await pool.query(
            `Insert into \`product_purchase\` (\`json\`,\`farmer\`) VALUES (\'${JSON.stringify(event)}\',\'${result.farmer}\')`
        );
    } catch (e) {
        //if it's 'duplicate record' error, do nothing, otherwise rethrow
        if (e.code != 'ER_DUP_ENTRY') {
            throw e;
        }
    }
}

async function getLatestCachedBlockI() {
    const defaultInitialBlock = 0;

    let dbResult = await pool.query(
        'select json_unquote(json_extract(`json`,\'$.blockNumber\')) \
        as block from product_purchase order by id desc limit 1'
    );
    return dbResult.length > 0 ? parseInt(dbResult[0].block) : defaultInitialBlock;
}

async function scanI() {
    const MaxBlockRange = 500000;

    let latestCachedBlock = await getLatestCachedBlockI(); // latest block written to database 
    let latestEthBlock = 0;   // latest block in blockchain

    await poll(async () => {
        try {
            //get latest block written to the blockchain
            latestEthBlock = await web3.eth.getBlockNumber();
            //divide huge block ranges to smaller chunks, of say 500000 blocks max
            latestEthBlock = Math.min(latestEthBlock, latestCachedBlock + MaxBlockRange);

            //if it is greater than cached block, search for events  
            if (latestEthBlock > latestCachedBlock) {
                await cacheEventsI(latestCachedBlock, latestEthBlock);

                //if everything is OK, update cached block value                
                //we need +1 because cacheEvents function includes events in both fromBlock and toBlock as well
                //with latest cached block incremented by 1 we can be sure that next time events found by 
                //the 'cacheEvents' will be completely new  
                latestCachedBlock = latestEthBlock + 1;
            }
        } catch (e) {
            //we might want to add some simple logging here
            console.log(e.toString());
        }
    });
}

async function cacheEventsII(latestCachedBlock, latestEthBlock) {
    let events = await veggie.getPastEvents(
        "DoneInspection",
        { filter: {}, fromBlock: latestCachedBlock, toBlock: latestEthBlock }
    );
    console.log(events);

    for (let event of events) {
        await writeEventII(event);
    }
}

async function writeEventII(event) {
    try {
        delete event.blockHash;
        delete event.removed;
        delete event.id;
        delete event.event;
        delete event.signature;
        delete event.raw;

        let result = JSON.parse(JSON.stringify(event.returnValues));

        await pool.query(
            `Insert into \`product_inspection\` (\`json\`,\`inspector\`) VALUES (\'${JSON.stringify(event)}\',\'${result.inspector}\')`
        );
    } catch (e) {
        //if it's 'duplicate record' error, do nothing, otherwise rethrow
        if (e.code != 'ER_DUP_ENTRY') {
            throw e;
        }
    }
}

async function getLatestCachedBlockII() {
    const defaultInitialBlock = 0;

    let dbResult = await pool.query(
        'select json_unquote(json_extract(`json`,\'$.blockNumber\')) \
        as block from product_inspection order by id desc limit 1'
    );
    return dbResult.length > 0 ? parseInt(dbResult[0].block) : defaultInitialBlock;
}

async function scanII() {
    const MaxBlockRange = 500000;

    let latestCachedBlock = await getLatestCachedBlockII(); // latest block written to database 
    let latestEthBlock = 0;   // latest block in blockchain

    await poll(async () => {
        try {
            //get latest block written to the blockchain
            latestEthBlock = await web3.eth.getBlockNumber();
            //divide huge block ranges to smaller chunks, of say 500000 blocks max
            latestEthBlock = Math.min(latestEthBlock, latestCachedBlock + MaxBlockRange);

            //if it is greater than cached block, search for events  
            if (latestEthBlock > latestCachedBlock) {
                await cacheEventsII(latestCachedBlock, latestEthBlock);

                //if everything is OK, update cached block value                
                //we need +1 because cacheEvents function includes events in both fromBlock and toBlock as well
                //with latest cached block incremented by 1 we can be sure that next time events found by 
                //the 'cacheEvents' will be completely new  
                latestCachedBlock = latestEthBlock + 1;
            }
        } catch (e) {
            //we might want to add some simple logging here
            console.log(e.toString());
        }
    });
}

async function cacheEventsIII(latestCachedBlock, latestEthBlock) {
    let events = await veggie.getPastEvents(
        "DoneWarehouse",
        { filter: {}, fromBlock: latestCachedBlock, toBlock: latestEthBlock }
    );
    console.log(events);

    for (let event of events) {
        await writeEventIII(event);
    }
}

async function writeEventIII(event) {
    try {
        delete event.blockHash;
        delete event.removed;
        delete event.id;
        delete event.event;
        delete event.signature;
        delete event.raw;

        let result = JSON.parse(JSON.stringify(event.returnValues));

        await pool.query(
            `Insert into \`product_warehouse\` (\`json\`,\`warehouseOfficer\`) VALUES (\'${JSON.stringify(event)}\',\'${result.warehouseOfficer}\')`
        );
    } catch (e) {
        //if it's 'duplicate record' error, do nothing, otherwise rethrow
        if (e.code != 'ER_DUP_ENTRY') {
            throw e;
        }
    }
}

async function getLatestCachedBlockIII() {
    const defaultInitialBlock = 0;

    let dbResult = await pool.query(
        'select json_unquote(json_extract(`json`,\'$.blockNumber\')) \
        as block from product_warehouse order by id desc limit 1'
    );
    return dbResult.length > 0 ? parseInt(dbResult[0].block) : defaultInitialBlock;
}

async function scanIII() {
    const MaxBlockRange = 500000;

    let latestCachedBlock = await getLatestCachedBlockIII(); // latest block written to database 
    let latestEthBlock = 0;   // latest block in blockchain

    await poll(async () => {
        try {
            //get latest block written to the blockchain
            latestEthBlock = await web3.eth.getBlockNumber();
            //divide huge block ranges to smaller chunks, of say 500000 blocks max
            latestEthBlock = Math.min(latestEthBlock, latestCachedBlock + MaxBlockRange);

            //if it is greater than cached block, search for events  
            if (latestEthBlock > latestCachedBlock) {
                await cacheEventsIII(latestCachedBlock, latestEthBlock);

                //if everything is OK, update cached block value                
                //we need +1 because cacheEvents function includes events in both fromBlock and toBlock as well
                //with latest cached block incremented by 1 we can be sure that next time events found by 
                //the 'cacheEvents' will be completely new  
                latestCachedBlock = latestEthBlock + 1;
            }
        } catch (e) {
            //we might want to add some simple logging here
            console.log(e.toString());
        }
    });
}

async function cacheEventsIV(latestCachedBlock, latestEthBlock) {
    let events = await order.getPastEvents(
        "DoneCustomerOrder",
        { filter: {}, fromBlock: latestCachedBlock, toBlock: latestEthBlock }
    );
    console.log(events);

    for (let event of events) {
        await writeEventIV(event);
    }
}

async function writeEventIV(event) {
    try {
        delete event.blockHash;
        delete event.removed;
        delete event.id;
        delete event.event;
        delete event.signature;
        delete event.raw;

        let result = JSON.parse(JSON.stringify(event.returnValues));

        await pool.query(
            `Insert into \`customer_order\` (\`json\`,\`customer\`,\`salesman\`) VALUES (\'${JSON.stringify(event)}\',\'${result.customer}\',\'${result.salesman}\')`
        );
    } catch (e) {
        //if it's 'duplicate record' error, do nothing, otherwise rethrow
        if (e.code != 'ER_DUP_ENTRY') {
            throw e;
        }
    }
}

async function getLatestCachedBlockIV() {
    const defaultInitialBlock = 0;

    let dbResult = await pool.query(
        'select json_unquote(json_extract(`json`,\'$.blockNumber\')) \
        as block from customer_order order by id desc limit 1'
    );
    return dbResult.length > 0 ? parseInt(dbResult[0].block) : defaultInitialBlock;
}

async function scanIV() {
    const MaxBlockRange = 500000;

    let latestCachedBlock = await getLatestCachedBlockIV(); // latest block written to database 
    let latestEthBlock = 0;   // latest block in blockchain

    await poll(async () => {
        try {
            //get latest block written to the blockchain
            latestEthBlock = await web3.eth.getBlockNumber();
            //divide huge block ranges to smaller chunks, of say 500000 blocks max
            latestEthBlock = Math.min(latestEthBlock, latestCachedBlock + MaxBlockRange);

            //if it is greater than cached block, search for events  
            if (latestEthBlock > latestCachedBlock) {
                await cacheEventsIV(latestCachedBlock, latestEthBlock);

                //if everything is OK, update cached block value                
                //we need +1 because cacheEvents function includes events in both fromBlock and toBlock as well
                //with latest cached block incremented by 1 we can be sure that next time events found by 
                //the 'cacheEvents' will be completely new  
                latestCachedBlock = latestEthBlock + 1;
            }
        } catch (e) {
            //we might want to add some simple logging here
            console.log(e.toString());
        }
    });
}

async function cacheEventsV(latestCachedBlock, latestEthBlock) {
    let events = await veggie.getPastEvents(
        "DoneShippingBatch",
        { filter: {}, fromBlock: latestCachedBlock, toBlock: latestEthBlock }
    );
    console.log(events);

    for (let event of events) {
        await writeEventV(event);
    }
}

async function writeEventV(event) {
    try {
        delete event.blockHash;
        delete event.removed;
        delete event.id;
        delete event.event;
        delete event.signature;
        delete event.raw;

        let result = JSON.parse(JSON.stringify(event.returnValues));

        await pool.query(
            `Insert into \`shippingBatch\` (\`json\`) VALUES (\'${JSON.stringify(event)}\')`
        );

        await pool.query(
            `Update \`customer_order\` SET \`shippingBatchNo\` = \'${result.shippingBatchNo}\' WHERE \`customerOrderNo\` = \'${result.customerOrderNo}\'`
        );
    } catch (e) {
        //if it's 'duplicate record' error, do nothing, otherwise rethrow
        if (e.code != 'ER_DUP_ENTRY') {
            throw e;
        }
    }
}

async function getLatestCachedBlockV() {
    const defaultInitialBlock = 0;

    let dbResult = await pool.query(
        'select json_unquote(json_extract(`json`,\'$.blockNumber\')) \
        as block from shippingBatch order by id desc limit 1'
    );
    return dbResult.length > 0 ? parseInt(dbResult[0].block) : defaultInitialBlock;
}

async function scanV() {
    const MaxBlockRange = 500000;

    let latestCachedBlock = await getLatestCachedBlockV(); // latest block written to database 
    let latestEthBlock = 0;   // latest block in blockchain

    await poll(async () => {
        try {
            //get latest block written to the blockchain
            latestEthBlock = await web3.eth.getBlockNumber();
            //divide huge block ranges to smaller chunks, of say 500000 blocks max
            latestEthBlock = Math.min(latestEthBlock, latestCachedBlock + MaxBlockRange);

            //if it is greater than cached block, search for events  
            if (latestEthBlock > latestCachedBlock) {
                await cacheEventsV(latestCachedBlock, latestEthBlock);

                //if everything is OK, update cached block value                
                //we need +1 because cacheEvents function includes events in both fromBlock and toBlock as well
                //with latest cached block incremented by 1 we can be sure that next time events found by 
                //the 'cacheEvents' will be completely new  
                latestCachedBlock = latestEthBlock + 1;
            }
        } catch (e) {
            //we might want to add some simple logging here
            console.log(e.toString());
        }
    });
}

async function cacheEventsVI(latestCachedBlock, latestEthBlock) {
    let events = await veggie.getPastEvents(
        "DoneShipping",
        { filter: {}, fromBlock: latestCachedBlock, toBlock: latestEthBlock }
    );
    console.log(events);

    for (let event of events) {
        await writeEventVI(event);
    }
}

async function writeEventVI(event) {
    try {
        delete event.blockHash;
        delete event.removed;
        delete event.id;
        delete event.event;
        delete event.signature;
        delete event.raw;

        await pool.query(
            `Insert into \`shipping\` (\`json\`) VALUES (\'${JSON.stringify(event)}\')`
        );
    } catch (e) {
        //if it's 'duplicate record' error, do nothing, otherwise rethrow
        if (e.code != 'ER_DUP_ENTRY') {
            throw e;
        }
    }
}

async function getLatestCachedBlockVI() {
    const defaultInitialBlock = 0;

    let dbResult = await pool.query(
        'select json_unquote(json_extract(`json`,\'$.blockNumber\')) \
        as block from shipping order by id desc limit 1'
    );
    return dbResult.length > 0 ? parseInt(dbResult[0].block) : defaultInitialBlock;
}

async function scanVI() {
    const MaxBlockRange = 500000;

    let latestCachedBlock = await getLatestCachedBlockVI(); // latest block written to database 
    let latestEthBlock = 0;   // latest block in blockchain

    await poll(async () => {
        try {
            //get latest block written to the blockchain
            latestEthBlock = await web3.eth.getBlockNumber();
            //divide huge block ranges to smaller chunks, of say 500000 blocks max
            latestEthBlock = Math.min(latestEthBlock, latestCachedBlock + MaxBlockRange);

            //if it is greater than cached block, search for events  
            if (latestEthBlock > latestCachedBlock) {
                await cacheEventsVI(latestCachedBlock, latestEthBlock);

                //if everything is OK, update cached block value                
                //we need +1 because cacheEvents function includes events in both fromBlock and toBlock as well
                //with latest cached block incremented by 1 we can be sure that next time events found by 
                //the 'cacheEvents' will be completely new  
                latestCachedBlock = latestEthBlock + 1;
            }
        } catch (e) {
            //we might want to add some simple logging here
            console.log(e.toString());
        }
    });
}

async function cacheEventsVII(latestCachedBlock, latestEthBlock) {
    let events = await veggie.getPastEvents(
        "DoneConsignment",
        { filter: {}, fromBlock: latestCachedBlock, toBlock: latestEthBlock }
    );
    console.log(events);

    for (let event of events) {
        await writeEventVII(event);
    }
}

async function writeEventVII(event) {
    try {
        delete event.blockHash;
        delete event.removed;
        delete event.id;
        delete event.event;
        delete event.signature;
        delete event.raw;

        let result = JSON.parse(JSON.stringify(event.returnValues));

        await pool.query(
            `Insert into \`customer_consignment\` (\`json\`,\`customer\`) VALUES (\'${JSON.stringify(event)}\',\'${result.customer}\')`
        );
    } catch (e) {
        //if it's 'duplicate record' error, do nothing, otherwise rethrow
        if (e.code != 'ER_DUP_ENTRY') {
            throw e;
        }
    }
}

async function getLatestCachedBlockVII() {
    const defaultInitialBlock = 0;

    let dbResult = await pool.query(
        'select json_unquote(json_extract(`json`,\'$.blockNumber\')) \
        as block from customer_consignment order by id desc limit 1'
    );
    return dbResult.length > 0 ? parseInt(dbResult[0].block) : defaultInitialBlock;
}

async function scanVII() {
    const MaxBlockRange = 500000;

    let latestCachedBlock = await getLatestCachedBlockVII(); // latest block written to database 
    let latestEthBlock = 0;   // latest block in blockchain

    await poll(async () => {
        try {
            //get latest block written to the blockchain
            latestEthBlock = await web3.eth.getBlockNumber();
            //divide huge block ranges to smaller chunks, of say 500000 blocks max
            latestEthBlock = Math.min(latestEthBlock, latestCachedBlock + MaxBlockRange);

            //if it is greater than cached block, search for events  
            if (latestEthBlock > latestCachedBlock) {
                await cacheEventsVII(latestCachedBlock, latestEthBlock);

                //if everything is OK, update cached block value                
                //we need +1 because cacheEvents function includes events in both fromBlock and toBlock as well
                //with latest cached block incremented by 1 we can be sure that next time events found by 
                //the 'cacheEvents' will be completely new  
                latestCachedBlock = latestEthBlock + 1;
            }
        } catch (e) {
            //we might want to add some simple logging here
            console.log(e.toString());
        }
    });
}

//-------------------------------------------------------------------------------------------------
// DonePurchaseBatch
scanI();

// DoneInspection
scanII();

// DoneWarehouse
scanIII();

// DoneCustomerOrder
scanIV();

// DoneShippingBatch
scanV();

// DoneShipping
scanVI();

// DoneConsignment
scanVII();

// scan()
//     .then(() => {
//         pool.end();
//     })
//     .catch(e => {
//         console.log(`Unexpected error. Work stopped. ${e}. ${e.stack}`);
//         pool.end();
//     });