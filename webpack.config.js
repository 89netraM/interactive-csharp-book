const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
	entry: {
		"code-component": path.resolve(__dirname, "src/code-component/index.ts")
	},
	mode: "development",
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
	plugins: [
		new HtmlPlugin({
			template: path.resolve(__dirname, "index.html"),
			title: "Interactive C# Book",
			base: "/"
		})
	],
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		port: 9090
	}
};