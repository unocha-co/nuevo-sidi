// Karma configuration
const webpackConfig = require('./webpack.config');

delete webpackConfig.entry;

module.exports = (config) => {
    config.set({
        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        reporters: ['spec', 'coverage', 'junit'],
        files: [
            'node_modules/jquery/dist/jquery.js',
            'src/angular-indeterminate.spec.js',
        ],
        preprocessors: {
            'src/*': ['webpack'],
        },
        coverageReporter: {
            dir: './coverage',
            reporters: [
                { type: 'html', subdir: '.' },
                { type: 'cobertura', subdir: '.' },
            ],
        },
        junitReporter: {
            outputDir: './coverage',
            outputFile: 'junit.xml',
            useBrowserName: false,
        },
        webpack: webpackConfig,
        webpackMiddleware: { noInfo: true },
    });
};
