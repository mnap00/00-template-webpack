const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeJsPlugin = require('optimize-js-plugin');

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
                new ExtractTextPlugin({
                    filename: 'css/[name].[hash].css',
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
                    test: /\.css$/,
                    use: env !== 'production'
                        ? [{
                            loader: 'style-loader'
                        }, {
                            loader: 'css-loader', options: {
                                modules: true
                            }
                        }]
                        : ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            use: [{
                                loader: 'css-loader', options: {
                                    minimize: true
                                }
                            }]
                        })
                },
                {
                    test: /\.(sass|scss)$/,
                    use: env !== 'production'
                        ? [{
                            loader: 'style-loader'
                        }, {
                            loader: 'css-loader', options: {
                                sourceMap: true,
                                modules: true
                            }
                        }, {
                            loader: 'sass-loader', options: {
                                sourceMap: true
                            }
                        }]
                        : ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            use: [{
                                loader: 'css-loader', options: {
                                    minimize: true
                                }
                            }, {
                                loader: 'sass-loader'
                            }]
                        })
                },
                {
                    test: /\.(png|svg|jp(e*)g|gif)$/,
                    exclude: /fonts/,
                    use: env !== 'production'
                        ? [{
                            loader: 'file-loader', options: {}
                        }]
                        : [{
                            loader: 'file-loader', options: {
                                name: 'images/[name].[hash].[ext]'
                            }
                        }]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                    exclude: /images/,
                    use: env !== 'production'
                        ? [{
                            loader: 'file-loader', options: {}
                        }]
                        : [{
                            loader: 'file-loader', options: {
                                name: 'fonts/[name].[hash].[ext]'
                            }
                        }]
                }
            ]
        },
        plugins: plugins
    };
};
