require('dotenv').config({path: './.env'});
const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
      host: "127.0.0.1",
      network_id: 5777
    },
    ganache_local: {
      provider: () => 
        new HDWalletProvider({
          mnemonic: {
            phrase: process.env.MNEMONIC
          },
          providerOrUrl: "http://127.0.0.1:7545",
          addressIndex: 0
        }),
        network_id: 5777
    }
  },
  compilers: {
    solc: {
      version: "0.8.11"
    }
  }
};
