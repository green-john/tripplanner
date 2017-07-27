const {series, rimraf} = require('nps-utils');

module.exports = {
    scripts: {
        test: {
            default: 'nps test.jest',
            jest: {
                default: series(
                    rimraf('test/jest-coverage.js'),
                    'jest'
                )
            },
        },

        build: 'nps webpack.build',

        webpack: {
            build: {
                before: rimraf('dist/'),
                default: 'nps webpack.build.dev',

                dev: {
                    default: series(
                        'nps webpack.build.before',
                        'webpack --progress -d'
                    )
                }
            }
        }
    }
};