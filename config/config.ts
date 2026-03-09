import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV = 'dev' } = process.env;

export default defineConfig({
  hash: true,
  routes,
  theme: {
    'root-entry-name': 'variable',
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV as keyof typeof proxy],
  fastRefresh: true,
  model: {},
  initialState: {},
  title: '幸运补给站',
  layout: {
    locale: false,
    ...defaultSettings,
  },
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  antd: {},
  request: {},
  access: {},
  headScripts: [
    {
      src: '/scripts/loading.js',
      async: true,
    },
  ],
  presets: ['umi-presets-pro'],
  mfsu: {
    strategy: 'normal',
  },
  esbuildMinifyIIFE: true,
});
