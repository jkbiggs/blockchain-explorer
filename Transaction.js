
class Transaction {
	constructor(tx){
        this.token = tx.token;
        this.sender = tx.sender;
        this.recipient = tx.recipient;
		this.amount = tx.value;
        this.time = tx.timestamp;
	}
}

module.exports.Transaction = Transaction;