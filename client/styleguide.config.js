module.exports = {
  components: 'src/components/**/[A-Z]*.{js,jsx,ts,tsx}',
  webpackConfig: require('./config/webpack.config.js'),
  // Enable modals to display properly inside style guide
  template: {
    body: {
      raw: '<div id="modal-container"></div>'
    }
  }
};
