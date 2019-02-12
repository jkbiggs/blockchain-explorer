
class Address {
	constructor(tx){
		this.transactions = []; // list of transactions
	}

	/*
		Gets the balance of the token for all transactions up to the timeStamp.
		If the timeStamp is -1, returns most update to date balance
	*/
	getBalanceByTimestamp(tokenId, timeStamp) {
		// traverse though transactions adding up all tx.amounts for a tokenId
		let amount = 0;
		let all = timeStamp == -1 ? true : false;
		this.transactions.forEach(tx => {
			if (tx.token == tokenId && (parseInt(tx.time) <= timeStamp || all)) {
				amount += parseInt(tx.amount); //TODO: use BigInt?
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