//const SHA256 = require('crypto-js/sha256');
//const BlockClass = require('./Block.js');
const db = require('./db/db');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class Controller {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.getTodos();
        //this.initializeMockData();
        //this.getBlockByIndex();
        //this.postNewBlock();
    }

    getTodos(){
        // get all todos
        this.app.get('/api/v1/todos', (req, res) => {
            res.status(200).send({
            success: 'true',
            message: 'todos retrieved successfully',
            todos: db
            })
        });
    }
    
    /*
        TODO: add endpoints for the following:

        /getTokenBalance/:token
        The balance of an account for a token at a given time

        /getTokenAverage/:token
        the average token transfer amount

        /getTokenMedian/:token
        the median token transfer amount

        /getAccountHighestBalance
        the account with the highest balance of a token at a given time

        /getAccountMostTransfers
        the account whose made the most transfers of a token at a given time
        TODO: what is meant by given time?
    */
    /**
     * GET Endpoint to retrieve a block by index, url: "/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            let index = req.params.index;
            if (index < 0 || index >= this.blocks.length) {
                res.status(404).json({
                    "error" : {    
                        "status": 404,
                        "message": "Block not found."   
                    }
                })
            } else {
                res.send(this.blocks[index]);
                //TODO: make sure star info is in response
            }
        });
    }

    /**
     * POST Endpoint to add a new Block, url: "/block"
     * Request should contain an address and star
     */
    postNewBlock() {
        this.app.post("/block", (req, res) => {
            if (req.body.address == undefined || req.body.address == "") {
                res.status(400).json({
                    "error" : {
                        "status": 400,
                        "message": "Empty block address."
                    }
                })
            } else {
                // create a new block from the request's body data
                let blockAux = new BlockClass.Block(req.body.body);
                blockAux.height = this.blocks.length;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                
                // get the previous blocks and retrieve it's hash
                if (this.blocks.length > 0) {
                    let previousBlock = this.blocks[this.blocks.length - 1];
                    blockAux.previousBlockHash = previousBlock.hash;
                }

                this.blocks.push(blockAux);
                res.status(201).send(blockAux);
            }
        });
    }


    /**
     * Help method to initialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                
                if (this.blocks.length > 0) {
                    let previousBlock = this.blocks[this.blocks.length - 1];
                    blockAux.previousBlockHash = previousBlock.hash;
                }
                this.blocks.push(blockAux);
            }
        }
    }

}

module.exports = (app) => { return new Controller(app);}