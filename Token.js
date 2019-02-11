
class Token {
	constructor(tx){
        this.transactionAmount = parseInt(tx.amount);
        this.transactionCount = 0;
        this.transactions = []; // list of transactions
    }

    addTransaction(tx) {
        this.transactions.push(tx);
        this.transactionAmount += Math.abs(parseInt(tx.amount));
        this.transactionCount++;
	}
	getTransactions() {
		return this.transactions;
	}

    getAverageTxAmount() {
		let total = this.transactionAmount;
		let numTx = this.transactionCount;

		return numTx > 0 ? total/numTx : 0;
	}

	getMedianTxAmount() {
		let txAmounts = this.getTxAmounts().sort();
		let numTx = txAmounts.length;
		let median = Math.ceil(numTx/2);
		
		return txAmounts[median];
    }

    getTxAmounts() {
        let txAmounts = [];
        this.transactions.forEach(tx => txAmounts.push(tx.amount));
		return txAmounts;
    }
}

module.exports.Token = Token;