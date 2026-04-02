const postcssPxToViewport = require('postcss-px-to-viewport-8-plugin')
module.exports = {
  plugins: {
    // 'postcss-pxtorem': {
    //   rootValue: 16, // html font-size，通常设置为16px
    //   unitPrecision: 5, // rem的小数点位数
    //   propList: ['*'], // 需要转换的属性，*表示所有属性
    //   selectorBlackList: [], // 忽略转换的选择器
    //   replace: true, // 是否替换包含rem的规则
    //   mediaQuery: false, // 是否在媒体查询中转换px
    //   minPixelValue: 0, // 最小的px值，小于这个值不转换
    //   exclude: /node_modules/i, // 排除node_modules文件夹
    // },

    'postcss-px-to-viewport-8-plugin': {
      unitToConvert: 'px',        // 要转换的单位
      viewportWidth: 1920,         // 设计稿宽度（一般 375 或 750）
      unitPrecision: 5,           // 转换后小数位
      propList: ['*'],            // 需要转换的属性，* 表示全部
      viewportUnit: 'vw',         // 转换成 vw
      fontViewportUnit: 'vw',     // 字体也转 vw
      selectorBlackList: ['ignore-'], // 忽略类名中包含 ignore- 的选择器
      minPixelValue: 1,           // 小于或等于1px不转换
      mediaQuery: false,          // 不在媒体查询中转换
      replace: true,              // 是否直接替换
      // exclude: [/node_modules/, /login/, /index/],  // 忽略文件
      exclude: [/node_modules/],  // 忽略文件
    },
  },
}