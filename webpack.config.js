const path = require("path");

module.exports = {
	entry: path.resolve(__dirname, "src/code-component/index.ts"),
	mode: "production",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader"
			},
			{
				test: /\.css$/,
				use: [ "style-loader", "css-loader" ]
			},
			{
				test: /\.ttf$/,
				use: "file-loader"
			}
		]
	},
	resolve: {
		extensions: [ ".ts", ".js" ]
	},
	output: {
		path: path.resolve(__dirname, "dist/client/"),
		publicPath: "code-component/",
		chunkFilename: "[id].chunk.js"
	}
};