const AddressClass = require('./Address.js');
const Address = AddressClass.Address;
const TokenClass = require('./Token.js');
const Token = TokenClass.Token;
const TransactionClass = require('./Transaction.js');
const Transaction = TransactionClass.Transaction;

const fs = require('fs');


class Controller {

    constructor(app) {
        this.app = app;
        this.addresses = [];  //associative array of addresses with tokens
        this.tokens = [];
        this.processDataFile();
        this.getTokenBalance();
        this.getAverageTransferAmount();
        this.getMedianTransferAmount();
        this.getHighestBalance();
    }
    // TODO: break out all logic?
    processDataFile() {
        // synchronously read data from data file
        console.log("loading...");
        let data = fs.readFileSync('./db/token_transfers.json');
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
                if (!this.addresses[sender]) {
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

        console.log("loading Complete");
    }

    /**
     * GET Endpoint to get an account's token balance at a given time 
     * url: "/address/{address}/token/{tokenId}/balance/{time}"
     */
    getTokenBalance() {
        this.app.get("/address/:address/token/:tokenId/balance/:time", (req, res) => {
            let address = req.params.address;
            let token = req.params.tokenId;
            let time = req.params.time;
            if (!address || address == "" || !this.addresses[address]) {
                res.status(404).json({
                    "error": {
                        "status": 404,
                        "message": "Address not found."
                    }
                });
            } else if (!token || token == "" || !this.tokens[token]) {
                res.status(404).json({
                    "error": {
                        "status": 404,
                        "message": "Token not found."
                    }
                });
            } else if (!time || time == "") {
                res.status(404).json({
                    "error": {
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
     */
    getAverageTransferAmount() {
        this.app.get("/token/:tokenId/averageTransferAmount", (req, res) => {
            let token = req.params.tokenId;
            if (!token || token == "" || !this.tokens[token]) {
                res.status(404).json({
                    "error": {
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
     * url: "/token/{tokenId}/medianTransferAmount"
     */
    getMedianTransferAmount() {
        this.app.get("/token/:tokenId/medianTransferAmount", (req, res) => {
            let token = req.params.tokenId;
            if (!token || token == "" || !this.tokens[token]) {
                res.status(404).json({
                    "error": {
                        "status": 404,
                        "message": "Token not found."
                    }
                });
            } else {
                res.status(200).send(this.tokens[token].getMedianTxAmount().toString());
            }
        });
    }

    /**
     * GET Endpoint to get the account with the highest balance of a token at a given time
     * url: "/token/{tokenId}/highestBalance/{time}
     */
    getHighestBalance() {
        this.app.get("/token/:tokenId/highestBalance/:time", (req, res) => {
            let token = req.params.tokenId;
            let time = req.params.time;
            if (!token || token == "" || !this.tokens[token]) {
                res.status(404).json({
                    "error": {
                        "status": 404,
                        "message": "Token not found."
                    }
                });
            } else {
                let highestBalance = this.getAccountHighestBalance(token, time);
                res.status(200).send(highestBalance.toString());
            }
        });
    }

    // get the address of the account with the highest balance of a given token at a given time
    getAccountHighestBalance(token, time) {
        let highestAccount = "";
        let highestBalance = 0;
        console.log("getAccountHighestBalance:");
        
        /*this.addresses.forEach(a => {
            console.log(a);
            console.log("we in here");
            let tokens = a.getTokens();
            console.log("getHighestBalance: tokens() : " + tokens)
            if (tokens.includes(token)) {
                let tempBalance = a.getBalanceByTimestamp(token, time);
                if (tempBalance > highestBalance) {
                    highestAccount = a;
                    highestBalance = tempBalance;
                }
            }
        });*/
        return highestAccount;
    }

    /*
        /token/mostTransactions
        tokenId, time
        the account whose made the most transfers of a token at a given time
 
    */
}

module.exports = (app) => { return new Controller(app); }