const path = require("path");

module.exports = {
  entry: "./src/index.tsx", // Adjust this based on your entry point
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js", // Adjust this based on your output settings
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader", // or 'babel-loader' with TypeScript preset
        exclude: /node_modules/,
      },
      // Other rules for your setup
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      types: path.resolve(__dirname, "src/types"), // Adjust if you're using aliases
    },
  },
  stats: "verbose", // This enables verbose logging
};
