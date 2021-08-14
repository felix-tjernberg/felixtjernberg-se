const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

if (process.env.NODE_ENV) {
  // Production configuration
  const ThreeMinifierPlugin = require('@yushijinhun/three-minifier-webpack')
  const threeMinifier = new ThreeMinifierPlugin()
  module.exports = {
    devServer: {
      contentBase: path.join(__dirname, 'build')
    },
    devtool: false,
    entry: {
      index: path.join(__dirname, 'source', 'index.js')
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset'
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          loader: 'html-loader',
          test: /\.html$/i
        },
        {
          exclude: /node_modules/,
          test: /\.js$/i,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    optimization: {
      minimizer: [
        '...',
        new CssMinimizerPlugin({
          minify: CssMinimizerPlugin.cleanCssMinify,
          minimizerOptions: { level: 2 }
        })
      ],
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/
          }
        }
      }
    },
    output: {
      assetModuleFilename: './[hash][ext][query]',
      clean: true,
      filename: './[name].[contenthash].js',
      path: path.join(__dirname, 'build')
    },
    plugins: [
      threeMinifier,
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({ template: './source/index.html' })
    ],
    resolve: {
      alias: {
        Icon: path.resolve(__dirname, 'source/assets/icon'),
        Image: path.resolve(__dirname, 'source/assets/image'),
        Javascript: path.resolve(__dirname, 'source/javascript'),
        Stylesheet: path.resolve(__dirname, 'source/stylesheet'),
        Svg: path.resolve(__dirname, 'source/assets/svg'),
        Texture: path.resolve(__dirname, 'source/assets/texture')
      },
      plugins: [threeMinifier.resolver]
    },
    target: 'browserslist'
  }
} else {
  // Development configuration
  const CopyPlugin = require('copy-webpack-plugin')
  module.exports = {
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      hot: true
    },
    devtool: 'source-map',
    entry: {
      index: path.join(__dirname, 'source', 'index.js')
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset'
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    optimization: {
      minimizer: [
        new ESBuildMinifyPlugin({
          css: true,
          target: 'es2015'
        })
      ],
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/
          }
        }
      }
    },
    output: {
      clean: true,
      filename: './[name].[contenthash].js',
      path: path.join(__dirname, 'build')
    },
    plugins: [
      new CopyPlugin({
        patterns: [{ from: 'source/assets/image', to: './' }]
      }),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({ template: './source/index.html' })
    ],
    resolve: {
      alias: {
        Icon: path.resolve(__dirname, 'source/assets/icon'),
        Image: path.resolve(__dirname, 'source/assets/image'),
        Javascript: path.resolve(__dirname, 'source/javascript'),
        Stylesheet: path.resolve(__dirname, 'source/stylesheet'),
        Svg: path.resolve(__dirname, 'source/assets/svg'),
        Texture: path.resolve(__dirname, 'source/assets/texture')
      }
    },
    stats: 'errors-warnings',
    target: 'web'
  }
}
