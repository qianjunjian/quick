const path = require('path');

module.exports = {
  productionSourceMap: false,
  configureWebpack: (config) => {
    if (process.env.NODE_ENV !== 'development') {
      // 清除开发中debug和console.log等等
      config.optimization.minimizer[0].options.terserOptions.warnings = false;
      config.optimization.minimizer[0].options.terserOptions.compress = {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      };
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        // 在这里的配置将会和默认配置合并，然后传递给electron-builder
        appId: 'com.example.quick', // 项目唯一标识
        productName: 'quick', // 打包产物的前缀
        copyright: 'qianjunjian', // 可用使用${}引用package.json里面配置项，配置项不存在会报错
        directories: {
          output: 'dist' // 打包产物的位置
        },
        // ------- windows 相关配置
        win: {
          target: ['nsis'] // 打包的目标类型,支持很多类型，具体看文档
        },
        nsis: {
          'oneClick': false,
          'perMachine': true,
          'allowToChangeInstallationDirectory': true // 允许修改安装目录
        }
      }
    }
  }
};
