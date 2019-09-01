// Karma configuration
// Generated on Wed Aug 28 2019 19:13:35 GMT+0200 (GMT+02:00)

var webpackConfig = require("./webpack-dev.config");
webpackConfig.module.rules.unshift({
    rules: [
        // instrument only testing sources with Istanbul
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "istanbul-instrumenter-loader",
                options: { esModules: true }
            },
            include: /app/
        }
    ]
});

var path = require("path");

process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],

        // list of files / patterns to load in the browser
        files: [
            "./app/app.js",
            "./node_modules/angular-mocks/angular-mocks.js",
            "./app/**/*.spec.js"
        ],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "./app/app.js": ["webpack"]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["spec", "coverage-istanbul"],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ["ChromeHeadless"],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        webpack: webpackConfig,

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: "errors-only"
        },

        // any of these options are valid: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-api/lib/config.js#L33-L39
        coverageIstanbulReporter: {
            // reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
            reports: ["text-summary"],

            // base output directory. If you include %browser% in the path it will be replaced with the karma browser name
            dir: path.join(__dirname, "reports"),

            // Combines coverage information from multiple browsers into one report rather than outputting a report
            // for each browser.
            combineBrowserReports: true,

            // if using webpack and pre-loaders, work around webpack breaking the source path
            fixWebpackSourcePaths: true,

            // Omit files with no statements, no functions and no branches from the report
            skipFilesWithNoCoverage: true,

            // Most reporters accept additional config options. You can pass these through the `report-config` option
            "report-config": {
                // all options available at: https://github.com/istanbuljs/istanbuljs/blob/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib/html/index.js#L135-L137
                html: {
                    // outputs the report in ./coverage/html
                    subdir: "html"
                }
            },

            // enforce percentage thresholds
            // anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
            thresholds: {
                emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
                // thresholds for all files
                global: {
                    statements: 50,
                    lines: 50,
                    branches: 50,
                    functions: 50
                },
                // thresholds per file
                each: {
                    statements: 50,
                    lines: 50,
                    branches: 50,
                    functions: 50
                }
            },

            verbose: false, // output config used by istanbul for debugging

            // `instrumentation` is used to configure Istanbul API package.
            instrumentation: {
                // To include `node_modules` code in the report.
                "default-excludes": false
            }
        }
    });
};
