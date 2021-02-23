module.exports = {
  plugins: {
      //作用生成浏览器CSS样式规则前缀
      // autoprefixer: {
      //   browsers: ['Android >= 4.0', 'iOS >= 8'],
      // },
    'postcss-pxtorem': {
        //postcss-pxtorem处理每个css文件的时候都会来调用这个函数
     // 它会把被处理的css文件相关的信息通过参数传递给该函数
      rootValue({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
        //配置要转换的CSS属性
        propList: ['*'],
      },
    },
  };