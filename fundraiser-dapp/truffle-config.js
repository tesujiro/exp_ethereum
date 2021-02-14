const path = require("path");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
	develop: {
	    host: "127.0.0.1",     // Localhost (default: none)
	    network_id: "*",       // Any network (default: none)
	    port: 8545,
	}
    }
};
