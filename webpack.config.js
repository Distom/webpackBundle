let path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssPresetEnv = require('postcss-preset-env');

let mode = process.env.NODE_ENV || 'development';
let devMode = mode === 'development';
let target = devMode ? 'web' : 'browserslist';
let devtool = devMode ? 'eval-cheap-module-source-map' : undefined;

let plugins = [
	new HtmlWebpackPlugin({
		template: path.resolve(__dirname, 'src', 'index.html')
	}),
	new MiniCssExtractPlugin({
		filename: 'style.[contenthash].css'
	}),
];

module.exports = {
	mode,
	target,
	devtool,
	entry: path.resolve(__dirname, 'src', 'index.js'),
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.[contenthash].js',
		clean: true,
		assetModuleFilename: 'assets/[name][ext]'
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},
	plugins,
	module: {
		rules: [
			// HTML
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			// STYLES
			{
				test: /\.(c|sc|sa)ss$/i,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[postcssPresetEnv],
								],
							},
						},
					},
					'sass-loader',
				],
			},
			// JS
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			// FONTS
			{
				test: /\.(woff2?|ttf|otf|eot)$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]'
				}
			},
			// IMAGES
			{
				test: /\.(png|jpe?g|svg)$/,
				type: 'asset/resource',
				use: {
					loader: 'image-webpack-loader',
					options: {
						mozjpeg: {
							progressive: true,
						},
						// optipng.enabled: false will disable optipng
						optipng: {
							enabled: false,
						},
						pngquant: {
							quality: [0.65, 0.90],
							speed: 4
						},
						gifsicle: {
							interlaced: false,
						},
						// the webp option will enable WEBP
						webp: {
							quality: 75
						}
					}
				},
				generator: {
					filename: 'img/[name][ext]'
				}
			},
		]
	}
}