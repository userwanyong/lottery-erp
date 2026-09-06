import { AvatarDropdown, AvatarName, Footer, GuideAssistant } from '@/components';
import { user_me } from '@/services/api';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { App } from 'antd';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { ensureFreshToken, getAuthToken } from './utils/auth';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async (): Promise<API.CurrentUser | undefined> => {
    // 有令牌时以服务端为准（auth-service 解析 token），本地存储仅作无网络时兜底
    if (!getAuthToken()) return undefined;
    try {
      await ensureFreshToken();
      const resp = await user_me();
      if (resp?.code === 1000 && resp.data?.id) {
        const data = resp.data;
        const roles = data.roles || [];
        const currentUser: API.CurrentUser = {
          userId: String(data.id),
          name: data.nickname || data.username || '用户',
          nickname: data.nickname,
          avatar: data.avatar,
          roles,
          permissions: data.permissions || [],
          access: roles.includes('ROLE_ADMIN') ? 'admin' : 'user',
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return currentUser;
      }
    } catch {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return undefined;
  };

  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('findDOMNode')) {
    return;
  }
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    args[0].includes('ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Access Token 15 分钟有效，定时检查并在到期前静默轮换
if (typeof window !== 'undefined') {
  window.setInterval(() => {
    if (getAuthToken()) {
      ensureFreshToken();
    }
  }, 60 * 1000);
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => <AvatarDropdown>{avatarChildren}</AvatarDropdown>,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpPpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="xybjz" to="/experience" target="">
            <LinkOutlined />
            <span>欢迎来到幸运补给站</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    childrenRender: (children) => {
      return (
        <App>
          {children}
          <GuideAssistant />
        </App>
      );
    },
    ...initialState?.settings,
  };
};

export const request = {
  ...errorConfig,
};
