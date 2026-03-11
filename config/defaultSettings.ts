import { ProLayoutProps } from '@ant-design/pro-components';

const settings: ProLayoutProps & {
  logo?: string;
} = {
  navTheme: 'light',
  splitMenus: true,
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '幸运补给站',
  logo: 'https://wanyj-xybjz.oss-cn-beijing.aliyuncs.com/logo.png',
  iconfontUrl: '',
  token: {},
};

export default settings;
