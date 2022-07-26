const {
  useBabelRc, override, useEslintRc, addPostcssPlugins, addBundleVisualizer,
} = require('customize-cra');
const { addReactRefresh } = require('customize-cra-react-refresh');
const path = require('path');

module.exports = override(
  useBabelRc(),
  useEslintRc(path.resolve(__dirname, '.eslintrc')),
  addPostcssPlugins([
    require('postcss-custom-media')({
      importFrom: [
        {
          customMedia: {
            '--phone': '(max-width: 1024px)'
          }
        },
        {
          customMedia: {
            '--desktop': '(min-width: 1025px)'
          }
        }
      ]
    }),
    require('postcss-simple-vars')(),
    require('postcss-nested'),
  ]),
  addReactRefresh(),
  addBundleVisualizer({
    analyzerMode: 'static',
    reportFilename: 'analyzer/report.html'
  }, true)
);
