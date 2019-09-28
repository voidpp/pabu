module.exports = {
    entry: "./pabu/assets/ts/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/pabu/static",
        libraryTarget: 'umd',
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    mode: 'production',

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
        ],
    },
    externals: [
        {
            "react": "React",
            "react-dom": "ReactDOM",
            "@material-ui/core": "MaterialUI",
            "react-beautiful-dnd": "ReactBeautifulDnd",
        },
    ]
};
