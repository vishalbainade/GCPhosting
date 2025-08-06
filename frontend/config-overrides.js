const webpack = require('webpack');

module.exports = function override(config, env) {
    // Your other fallbacks are great, we just need to correct 'process'
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "process": require.resolve("process/browser"),
        "buffer": require.resolve("buffer/"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "url": require.resolve("url/"),
        "util": require.resolve("util/"),
        "zlib": require.resolve("browserify-zlib"),
        "crypto": require.resolve("crypto-browserify")
    };

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: require.resolve('process/browser.js'),
            Buffer: ['buffer', 'Buffer']
        })
    ]);

    // This part is excellent! You have already fixed the deprecation warnings.
    config.devServer = {
        ...config.devServer,
        setupMiddlewares: (middlewares, devServer) => {
            // You can add your custom middlewares here if needed
            return middlewares;
        },
    };

    return config;
};