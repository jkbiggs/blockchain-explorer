const AddressClass = require('./Address.js');
const Address = AddressClass.Address;
const TokenClass = require('./Token.js');
const Token = TokenClass.Token;
const TransactionClass = require('./Transaction.js');
const Transaction = TransactionClass.Transaction;


const db = require('./db/db');
const fs = require('fs');


class Controller {

    constructor(app) {
        this.app = app;
        this.addresses = [];  //associative array of addresses with tokens
        this.tokens = [];
        this.processDataFile();
        this.getTokenBalance();
        //this.getTokenAverage();
        //this.getTokenMedian();
        //this.getAccountHighestBalance();
        //this.getAccountMostTransfers();
    }
    // TODO: break out all logic?
    processDataFile() {
        // synchronously read data from data file
        let data = fs.readFileSync('./db/testData.json');  
        let logs = JSON.parse(data);
        let i = 0;
        logs.forEach(log => {
            // 1. create a Transaction from the log record
            let tx = new Transaction(log);
            let token = tx.token;
            let recipient = tx.recipient;
            let sender = tx.sender;
            
            // 2. recipient address doesn't exist - create a new one and add tx
            if (!this.addresses[recipient]) {
                this.addresses[recipient] = new Address(tx);
            }
                
            this.addresses[recipient].addTransaction(tx);
            
            // 3. if sender is isn't null, we need to add tx to sender too
            if (sender) {
                if(!this.addresses[sender]) {
                    this.addresses[sender] = new Address(tx);
                }
                this.addresses[sender].addTransaction(tx);
            }  
            // 4. token doesn't exist - create a new one and add tx
            if (!this.tokens[token]) {
                this.tokens[token] = new Token(tx);
            }

            this.tokens[token].addTransaction(tx);

        });
        
        console.log(this.addresses);
        console.log("address getTransactions: " + this.addresses['0x3cd3daa88db6d1ac2735edccdf7eb96cba9f9a48'].getTransactions());
        console.log("getBalanceByTimestamp: " + this.addresses['0x3cd3daa88db6d1ac2735edccdf7eb96cba9f9a48'].getBalanceByTimestamp('0xd5524179cb7ae012f5b642c1d6d700bbaa76b96b', 1534373664));
        
        console.log(this.tokens);
        console.log("getAverageTxAmount: " + this.tokens['0xd5524179cb7ae012f5b642c1d6d700bbaa76b96b'].getAverageTxAmount());
        console.log("getMedianTxAmount: " +  this.tokens['0xd5524179cb7ae012f5b642c1d6d700bbaa76b96b'].getMedianTxAmount());
        
    }

    /**
     * GET Endpoint to get an account's token balance at a given time 
     * url: "/address/{address}/token/{tokenId}/getTokenBalance"
     * Request body should contain a token id and timeStamp
     */
    getTokenBalance() {
        this.app.get("/address/:address/token/:tokenId/tokenBalance", (req, res) => {
            let address = req.params.address;
            let token = req.params.token;
            let time = req.params.timestamp;
            if (!address || address == "" || !this.addresses[address]) {
                res.status(404).json({
                    "error" : {    
                        "status": 404,
                        "message": "Address not found."   
                    }
                });
            } else if (!token || token == "") { //TODO: validate token exists
                res.status(404).json({
                    "error" : {    
                        "status": 404,
                        "message": "Token not found."   
                    }
                });
            } else if (!time || time == "") {
                res.status(404).json({
                    "error" : {    
                        "status": 404,
                        "message": "Time not found."   
                    }
                });
            } else {
                res.status(200).send(this.addresses[address].getBalanceByTimestamp(token, time).toString());
            }
        });
    }

    /**
     * GET Endpoint to get the average transfer amount for a token 
     * url: "/token/{tokenId}/averageTransferAmount"
     * Request body should contain a token id and timeStamp
     */
    getAverageTransferAmount() {
        this.app.get("/token/:token/averageTransferAmount", (req, res) => {
            let token = req.params.token;
            if (!token || token == "") { //TODO: validate token exists
                res.status(404).json({
                    "error" : {    
                        "status": 404,
                        "message": "Token not found."   
                    }
                });
            } else {
                res.status(200).send(this.tokens[token].getAverageTxAmount().toString());
            }
        });
    }
    /**
     * GET Endpoint to get the median transfer amount for a token 
     * url: "/token/{tokenId}/getAverageTransferAmount"
     * Request body should contain a token id and timeStamp
     */
    getAverageTransferAmount() {
        this.app.get("/token/:token/medianTransferAmount", (req, res) => {
            let token = req.params.token;
            if (!token || token == "") { //TODO: validate token exists
                res.status(404).json({
                    "error" : {    
                        "status": 404,
                        "message": "Token not found."   
                    }
                });
            } else {
                res.status(200).send(this.tokens[token].getAverageTxAmount().toString());
            }
        });
    }
    /*
        
        TODO: add endpoints for the following:
        /token/medianTransferAmount
        tokenId
        the median token transfer amount

        /token/highestBalance
        tokenId, time
        the account with the highest balance of a token at a given time

        /token/mostTransactions
        tokenId, time
        the account whose made the most transfers of a token at a given time
        TODO: what is meant by given time?
    */
} 

module.exports = (app) => { return new Controller(app);}