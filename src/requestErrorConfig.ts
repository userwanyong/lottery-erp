import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';
import { stringify } from 'querystring';

function clearAuthAndRedirect() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
  localStorage.removeItem('currentUser');
  const { search, pathname } = window.location;
  if (pathname !== '/user/login') {
    history.replace({
      pathname: '/user/login',
      search: stringify({ redirect: pathname + search }),
    });
  }
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  errorConfig: {
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          // 401 由响应拦截器处理 token 刷新，此处兜底处理刷新失败的情况
          clearAuthAndRedirect();
          message.error('登录已过期，请重新登录');
        } else if (status === 403) {
          message.error('没有权限访问');
        } else {
          message.error(`请求失败：${status}`);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        message.error('服务器无响应，请稍后重试');
      } else {
        // 发送请求时出了点问题
        message.error('请求异常，请重试');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (url, options) => {
      const token = localStorage.getItem('authToken');
      const headers = { ...(options?.headers || {}) } as Record<string, string>;
      if (token) {
        headers.Authorization = token;
      }
      return { url, options: { ...options, headers } };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      return response;
    },
  ],
};
