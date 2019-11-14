module.exports = {
  devServer: {
    host: '127.0.0.1',
    port: 9990,
    // disableHostCheck: true, //  新增该配置项
    proxy: 'http://39.108.136.61:8801'
    // proxy: 'http://192.168.0.6'
    //   'http://47.102.104.124': {
    //     target: 'http://47.102.104.124', // target host
    //     changeOrigin: true, // needed for virtual hosted sites
    //     ws: true, // proxy websockets
    //   }

    // },
  }
}
