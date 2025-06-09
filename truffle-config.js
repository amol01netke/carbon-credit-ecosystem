module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545,        // Standard Ethereum port (default: none)
      network_id: "*",   // Any network (default: none)
    },
  },

  compilers: {
    solc: {
      version: "^0.8.19", // Use Solidity version 0.8.x or higher
    }
  },
};
