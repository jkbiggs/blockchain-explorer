const express = require("express");

class BlockExplorerAPI {

    constructor() {
		this.app = express();
		this.initExpress();
		this.initControllers();
		this.start();
	}

	initExpress() {
		this.app.set("port", 5000);
	}

	initControllers() {
		require("./Controller.js")(this.app);
	}

	start() {
		let self = this;
		this.app.listen(this.app.get("port"), () => {
			console.log(`Server Listening for port: ${self.app.get("port")}`);
		});
	}
}

new BlockExplorerAPI();