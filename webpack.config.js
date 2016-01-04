module.exports = {
	entry: {
		dev: './src/ts/site'
	},
	output: {
		filename: './com/js/site.js'
	},
	resolve: {
		extensions: ['.ts', '.tsx']
	},
	module: {
		loaders: [
			// Typescript
			{ test: /\.ts/, loader: 'ts-loader' }
		]
	}
}
