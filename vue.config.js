module.exports = {
  css: {
    extract: false // 是否将组件中的 CSS 提取至一个独立的 CSS 文件中。设置为 false 免得用户自己导入 CSS。
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.externals = {}
      config.externals.three = {
        commonjs: "three",
        commonjs2: "three",
        root: "THREE"
      }
      
      // 参考 issues 追踪 1
      config.module.rules.forEach(rule => {
        if (rule.use) {
          let idx = rule.use.findIndex(w => w.loader === 'thread-loader')
          if (idx !== -1) rule.use.splice(idx, 1)
        }
      })
    } else if (process.env.NODE_ENV === 'development') {
      config.entry.app = ['./example/main.js']
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // disable cache (not sure if this is actually useful...)
      config.module.rule("ts").uses.delete("cache-loader");
      // 参考 issues 追踪 1
      config.module
        .rule('ts')
        .use('ts-loader')
        .loader('ts-loader')
        .tap(opts => {
          opts.transpileOnly = false;
          opts.happyPackMode = false;
          return opts;
        });
    }
  }
}

/* 
  issues 追踪 1
  https://github.com/vuejs/vue-cli/issues/1081
  https://github.com/vuejs/vue-cli/issues/2171
*/