import { ProLayoutProps } from '@ant-design/pro-components';

const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  splitMenus: true, //将二级菜单拆出来，原先的一级菜单放到顶部
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '幸运补给站',
  pwa: true,
  logo: 'https://wanyj-xybjz.oss-cn-beijing.aliyuncs.com/logo.png',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
  },
};

export default Settings;
