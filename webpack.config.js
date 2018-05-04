const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const plugins = [
    new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: 'body'
    })
];

module.exports = (env) => {
    const devMode = env !== 'production';
    devMode
        ? null
        : (
            plugins.push(
                new CleanWebpackPlugin(['dist'])
            ),
            //            plugins.push(
            //                new CopyWebpackPlugin([
            //                    {
            //                        from: path.resolve(__dirname, './static'),
            //                        to: path.resolve(__dirname, '../dist/assets')
            //                    }
            //                ], {
            //                    ignore: ['*.js', '*.css', '*.html']
            //                })
            //            ),
            plugins.push(
                new MiniCssExtractPlugin({
                    filename: 'css/[name].[contenthash:20].css',
                    chunkFilename: 'css/[id].[contenthash:20].css'
                })
            ),
            plugins.push(
                new OptimizeJsPlugin({
                    sourceMap: false
                })
            )
        );

    return {
        mode: env || 'production',
        entry: './src/index.js',
        devtool: devMode ? 'inline-source-map' : false,
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true
                }),
                new OptimizeCssAssetsPlugin({})
            ]
        },
        output: {
            filename: 'js/[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                        plugins: devMode
                            ? ['react-hot-loader/babel']
                            : []
                    }
                },
                {
                    test: /^((?!\.?(main|style)).)*s?[ac]ss$/,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader', options: {
                                camelCase: true,
                                importLoaders: 1,
                                localIdentName: '[local]___[hash:7]',
                                modules: true,
                                sourceMap: true
                            }
                        }, {
                            loader: 'sass-loader', options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.?(main|style).s?[ac]ss$/,
                    use: [
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader', options: {
                                importLoaders: 1,
                                sourceMap: true
                            }
                        }, {
                            loader: 'sass-loader', options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jp(e*)g|gif)$/,
                    exclude: path.resolve(__dirname, 'src/fonts'),
                    use: [
                        {
                            loader: 'url-loader', options: {
                                limit: 8192,
                                name: devMode
                                    ? null
                                    : 'images/[name].[hash:20].[ext]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                    exclude: path.resolve(__dirname, 'src/images'),
                    use: [
                        {
                            loader: 'url-loader', options: {
                                limit: 8192,
                                name: devMode
                                    ? null
                                    : 'fonts/[name].[hash:20].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: plugins
    };
};
