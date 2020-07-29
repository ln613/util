const webpack = require("webpack");
const path = require('path');

module.exports = {
entry: './src/index.js',
output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
},
module: {
    rules: [
        {
            test: /\.js$/, //using regex to tell babel exactly what files to transcompile
            exclude: /node_modules/, // files to be ignored
            use: {
                loader: 'babel-loader' // specify the loader
            } 
        }
    ]
},
resolve: {
  extensions: ['.js'],
  alias: {
    'util': path.resolve(__dirname, 'src/util')  // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
  }
},

plugins: [

  // ...

  new webpack.ProvidePlugin({
    'util': 'util'
  })
]
}