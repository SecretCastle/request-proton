const webpack = require('webpack');
const path = require('path');


module.exports = {
	entry: ['./src/index.js'],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'umd2'
	},
	module:{
		rules: [
			{
				test: /\.js$/,
				loaders: ['babel-loader', 'eslint-loader'],
				exclude: /node_modules/
			},{
				test: /\.jsx$/,
				loaders: ['babel-loader', 'eslint-loader'],
				exclude: /node_modules/
			},{
				test: /\.css$/,
				loader: ['style-loader', 'css-loader'],
				exclude: /node_modules/
			}
		]
	},
	plugins: [
    
	]
};