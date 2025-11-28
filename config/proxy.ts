/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整
  dev: {
    '/api/': {
      target: process.env.DEV_API_TARGET || 'http://127.0.0.1:8091',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^': '' },
    },
  },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    '/api/': {
      target: process.env.TEST_API_TARGET || 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: process.env.PRE_API_TARGET || 'your pre url',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^': '' },
    },
  },
};
