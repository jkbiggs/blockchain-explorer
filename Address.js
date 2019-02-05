
class Address {
	constructor(tx){
		this.transactions = []; // list of transactions
	}

	getBalance(tokenId) {
		// traverse though transactions adding up all tx.amounts for a tokenId
		let amount = 0;
		this.transactions.forEach(tx => {
			if (tx.token == tokenId) {
				amount += parseInt(tx.amount); //TODO: need BigInt?
			}
		});
		
		return amount;
	}

	getBalanceByTimestamp(tokenId, timeStamp) {
		// this would be faster with a sorted array, but maintenance could be a pain
		// traverse though transactions adding up all tx.amounts for a tokenId
		let amount = 0;
		this.transactions.forEach(tx => {
			if (tx.token == tokenId && parseInt(tx.time) <= timeStamp) {
				amount += parseInt(tx.amount); //TODO: need BigInt?
			}
		});
		
		return amount;
	}

	addTransaction(tx) {
		this.transactions.push(tx);
	}
	getTransactions() {
		return this.transactions;
	}

	getTransactionsByTokenId(tokenId) {
		return this.transactions.filter(t => t.token == tokenId);
	}

	//TODO: remove duplicates
	getTokens() {
		return this.transactions.map(t => t.token);
	}
}

module.exports.Address = Address;