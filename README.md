# blockchain-explorer
Write a blockchain data processing application

## Framework used
Express.js - for creating rest endpoints

## Getting started
Clone the repository to your local computer.
```
git clone https://github.com/jkbiggs/blockchain-explorer.git
```

Open the terminal and change directory to blockchain-explorer
```
cd blockchain-explorer
```

Install the project packages:
```
npm install
```

## Testing
Run the server:
```
npm run start
```

Use a software like Postman (or a simple CURL on the terminal) to send the requests to the base url http://localhost:5000 with one of the below supported endpoints:

### GET
Get the account balance for a given token at a given time
* http://localhost:5000/address/{addressId}/token/{tokenId}/balance/{time} --you may use -1 for the time in order to get latest

Get the average transfer amount for a given token
* http://localhost:5000/token/{tokenId}/averageTransferAmount

Get the median transfer amount for a given token
* http://localhost:5000/token/{tokenId}/medianTransferAmount

Get the account with the highest balance of a given token at a given time --you may use -1 for the time in order to get latest
* http://localhost:5000/token/{tokenId}/highestBalance/{time}

Get the account that has the most transfers of a given token at a given time --you may use -1 for the time in order to get latest
* http://localhost:5000/token/{tokenId}/mostTransactions/{time}

```
 curl http://localhost:5000/address/{addressId}/token/{tokenId}/balance/{time}
```

NOTES:
- I'm using associative arrays (ish) to store the addresses and tokens in order to speed up retrieval time to 0(1)
- I come from a Java background so this (using a map) made the most sense to me