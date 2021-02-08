const { override, fixBabelImports, addLessLoader, addExternalBabelPlugins } = require('customize-cra');
module.exports = override(
  ...addExternalBabelPlugins('babel-plugin-transform-do-expressions', '@babel/plugin-proposal-object-rest-spread'),
  fixBabelImports('import-antd', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  fixBabelImports('import-antd-icons', {
    libraryName: '@ant-design/icons',
    libraryDirectory: 'es/icons',
    camel2DashComponentName: false,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#34478c',
      '@border-radius-base': '5px',
      '@border-radius-sm': '5px',

      '@menu-highlight-color': '#1876f2',
      '@menu-item-active-bg': '#e7f3ff',
      // "@table-header-bg": "#344394",
      // "@table-header-color": "#fff",
    },
  })
);
