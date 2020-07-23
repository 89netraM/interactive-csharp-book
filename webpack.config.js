const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

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
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "node_modules/browser-csharp/out/_framework"),
					to: "_framework"
				}
			]
		})
	],
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		port: 9090
	}
};