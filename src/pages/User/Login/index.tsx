import {
  AlipayCircleOutlined,
  LockOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { ProFormCheckbox } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, message, Button, Input, Form, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState, useEffect } from 'react';
import { user_login } from '@/services/api';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(() => ({
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F7F2E6', // 温暖的象牙白背景，替代纯白色
  },
  leftPanel: {
    flex: 0.83, // 减小左侧面板占比，让图片宽度更合适
    backgroundColor: '#EFE7DB', // 添加背景色作为图片加载前的fallback
    backgroundImage: 'url(https://wanyj-xybjz.oss-cn-beijing.aliyuncs.com/beijingtu.png)',
    backgroundSize: 'cover', // 改为cover让图片占满整个区域
    backgroundPosition: 'center center', // 精确居中定位
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll', // 改为scroll避免fixed带来的问题
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // 改为居中布局，让内容更饱满
    padding: '0', // 移除内边距让背景图片完全填充
    position: 'relative',
    minHeight: '100vh', // 确保最小高度
    filter: 'saturate(0.95)',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'rgba(247, 242, 230, 0.18)',
      pointerEvents: 'none',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100px',
      height: '100%',
      background:
        'linear-gradient(to right, rgba(247, 242, 230, 0) 0%, rgba(247, 242, 230, 0.55) 60%, rgba(247, 242, 230, 0.96) 100%)',
      pointerEvents: 'none',
    },
    '@media (max-width: 768px)': {
      display: 'none', // 移动端隐藏左侧面板，显示完整背景图片
    },
  },
  rightPanel: {
    flex: 1, // 增加右侧面板占比，平衡布局
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: '#F7F2E6', // 温暖的象牙白背景，替代纯白色
    '@media (max-width: 768px)': {
      flex: 'none',
      width: '100%',
      padding: '16px', // 移动端减小内边距
      alignItems: 'center', // 移动端居中对齐
      justifyContent: 'center', // 移动端垂直居中
      minHeight: '100vh', // 移动端占满视口高度
      backgroundColor: '#F7F2E6', // 移动端也保持温暖背景
    },
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // 确保内容居中
    gap: '12px', // 适当减小图标和文字间距
    marginBottom: '0px', // 进一步减小底部间距，让标题更接近登录表单
  },
  logoIcon: {
    width: '48px', // 增大图标尺寸
    height: '48px',
    backgroundColor: '#7A5638', // 温暖的古铜棕色，匹配传统风格
    borderRadius: '10px', // 稍微增加圆角
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#F7F2E6', // 象牙白文字，与背景协调
    fontSize: '24px', // 增大字体
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: '28px', // 增大品牌文字
    fontWeight: 'bold',
    color: '#7A5638', // 温暖的古铜棕色，匹配传统风格
    margin: 0,
  },
  headline: {
    fontSize: '56px', // 增大标题字体
    fontWeight: 'bold',
    color: '#7A5638', // 温暖的古铜棕色，匹配传统风格
    marginBottom: '24px', // 增加底部间距
    lineHeight: 1.2,
  },
  subtext: {
    fontSize: '18px', // 增大副标题字体
    color: '#8A7D73', // 温暖的灰色，匹配传统风格
    marginBottom: '64px', // 增加底部间距
    lineHeight: 1.6,
  },
  illustration: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  illustrationGraphic: {
    width: '480px', // 增大图形尺寸
    height: '360px',
    background: 'linear-gradient(45deg, #D3A94C 0%, #C8A04A 100%)', // 温暖的金色渐变
    borderRadius: '24px', // 增加圆角
    opacity: 0.15, // 稍微增加透明度
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '24px',
      left: '24px',
      right: '24px',
      bottom: '24px',
      background: 'rgba(247, 242, 230, 0.8)', // 温暖的象牙白背景
      borderRadius: '16px',
    },
  },
  reactionIcons: {
    position: 'absolute',
    bottom: '32px', // 增加底部距离
    left: '32px', // 增加左侧距离
    display: 'flex',
    gap: '16px', // 增加图标间距
  },
  reactionIcon: {
    width: '40px', // 增大图标尺寸
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#7A5638', // 温暖的古铜棕色
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#F7F2E6', // 温暖的象牙白文字
    fontSize: '18px', // 增大图标字体
  },
  leftPanelContent: {
    padding: '48px 64px', // 将内边距移到内容容器
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brandHeader: {
    display: 'flex',
    justifyContent: 'center', // 水平居中
    alignItems: 'center', // 垂直居中
    marginBottom: '16px', // 进一步减小底部间距，让标题更接近登录表单
    paddingTop: '16px', // 减小顶部内边距
    // 移动端也显示这个品牌标题
  },
  loginCard: {
    width: '100%',
    maxWidth: '450px', // 增大登录卡片宽度
    backgroundColor: '#F7F2E6', // 温暖的象牙白背景，融入左侧传统风格
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(139, 69, 19, 0.15)', // 温暖的棕色阴影
    padding: '24px 40px', // 减小顶部和底部内边距，让布局更紧凑
    ':global(.ant-form-item-has-error .ant-input-affix-wrapper)': {
      backgroundColor: '#F7F2E6 !important',
      borderColor: '#C95C3A !important',
      boxShadow: 'none !important',
    },
    ':global(.ant-form-item-has-error .ant-input-affix-wrapper .ant-input)': {
      backgroundColor: '#F7F2E6 !important',
    },
    '@media (max-width: 768px)': {
      padding: '24px 20px', // 移动端保持合适的内边距
      boxShadow: '0 4px 16px rgba(139, 69, 19, 0.1)', // 移动端温暖阴影
      borderRadius: '16px', // 保持移动端圆角
      minHeight: 'auto', // 改为自动高度
      margin: '16px auto',
      width: '360px',
    },
  },
  formItem: {
    marginBottom: '24px', // 增加底部间距，因为移除了其他元素
    '& .ant-form-item-control-input': {
      backgroundColor: 'transparent', // 透明背景
    },
  },
  input: {
    height: '48px',
    borderRadius: '8px',
    border: '1px solid #C8A04A', // 温暖的金色边框
    fontSize: '16px',
    backgroundColor: '#F7F2E6',
    color: '#7A5638',
    '&:hover': {
      borderColor: '#7A5638',
      backgroundColor: '#F7F2E6',
      boxShadow: 'none',
    },
    '&.ant-input-affix-wrapper-focused': {
      borderColor: '#7A5638',
      boxShadow: 'none',
      backgroundColor: '#F7F2E6',
    },
    '&.ant-input-affix-wrapper-status-error, &.ant-input-status-error': {
      backgroundColor: '#F7F2E6 !important',
      borderColor: '#C95C3A !important',
      boxShadow: 'none !important',
    },
    '&.ant-input-affix-wrapper-status-error:hover, &.ant-input-status-error:hover': {
      borderColor: '#C95C3A !important',
      boxShadow: 'none !important',
      backgroundColor: '#F7F2E6 !important',
    },
    '&.ant-input-affix-wrapper-status-error .ant-input, &.ant-input-status-error .ant-input': {
      backgroundColor: '#F7F2E6 !important',
    },
    '& .ant-input': {
      backgroundColor: 'transparent',
      color: '#7A5638',
    },
    '& .ant-input:focus': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
    '&:hover .ant-input': {
      backgroundColor: 'transparent',
    },
    '& .ant-input::placeholder': {
      color: '#8A7D73',
    },
    '& .ant-input-prefix': {
      color: '#7A5638',
    },
    '& .ant-input-suffix': {
      color: '#8A7D73',
    },
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#8A7D73', // 温暖的灰色
    fontSize: '18px',
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: '24px',
  },
  forgotPasswordLink: {
    color: '#7A5638', // 温暖的古铜棕色
    fontSize: '14px',
    textDecoration: 'none',
    lineHeight: '1', // Match checkbox text line height
    paddingTop: '0 !important',
    paddingBottom: '0 !important',
    marginTop: '0 !important',
    marginBottom: '0 !important',
    verticalAlign: 'baseline', // Ensure baseline alignment
    '&:hover': {
      color: '#6B4A2E', // 稍深的温暖棕色
      textDecoration: 'underline',
    },
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'baseline',
    height: 'auto',
    lineHeight: '1',
    '& .ant-checkbox': {
      marginTop: '0 !important',
      marginBottom: '0 !important',
      transform: 'translateY(0.5px)',
    },
    '& .ant-checkbox + span': {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
      lineHeight: '1',
      fontSize: '14px',
      color: '#8A7D73',
    },
    '& .ant-checkbox-inner': {
      borderColor: '#C8A04A',
      backgroundColor: 'transparent',
    },
    '& .ant-checkbox:hover .ant-checkbox-inner': {
      borderColor: '#C8A04A !important',
    },
    '& .ant-checkbox-input:focus + .ant-checkbox-inner': {
      boxShadow: 'none',
      borderColor: '#7A5638 !important',
    },
    '& .ant-checkbox-checked .ant-checkbox-inner': {
      backgroundColor: '#7A5638 !important',
      borderColor: '#7A5638 !important',
    },
    '& .ant-checkbox-checked:hover .ant-checkbox-inner': {
      backgroundColor: '#6B4A2E !important',
      borderColor: '#6B4A2E !important',
    },
  },
  loginButton: {
    width: '100%',
    height: '48px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#7A5638 !important',
    borderColor: '#7A5638 !important',
    color: '#F7F2E6 !important',
    boxShadow: '0 2px 8px rgba(122, 86, 56, 0.3)',
    '&:hover': {
      backgroundColor: '#6B4A2E !important',
      borderColor: '#6B4A2E !important',
      color: '#F7F2E6 !important',
      boxShadow: '0 2px 8px rgba(122, 86, 56, 0.35)',
    },
    '&:focus': {
      backgroundColor: '#6B4A2E !important',
      borderColor: '#6B4A2E !important',
      color: '#F7F2E6 !important',
    },
  },
  captchaButton: {
    height: '48px',
    borderRadius: '8px',
    backgroundColor: '#7A5638 !important',
    borderColor: '#7A5638 !important',
    color: '#F7F2E6 !important',
    boxShadow: '0 2px 6px rgba(122, 86, 56, 0.25)',
    padding: '0 16px',
    '&:hover': {
      backgroundColor: '#6B4A2E !important',
      borderColor: '#6B4A2E !important',
      color: '#F7F2E6 !important',
      boxShadow: '0 2px 8px rgba(122, 86, 56, 0.30)',
    },
    '&:focus': {
      backgroundColor: '#6B4A2E !important',
      borderColor: '#6B4A2E !important',
      color: '#F7F2E6 !important',
      boxShadow: 'none',
    },
  },
  helperText: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: '#8A7D73', // 温暖的灰色
  },
  createAccountLink: {
    color: '#7A5638', // 温暖的古铜棕色
    textDecoration: 'none',
    '&:hover': {
      color: '#6B4A2E', // 稍深的温暖棕色
      textDecoration: 'underline',
    },
  },
  divider: {
    textAlign: 'center',
    margin: '32px 0 24px',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      height: '1px',
      backgroundColor: '#C8A04A', // 温暖的金色分隔线
    },
  },
  dividerText: {
    backgroundColor: '#F7F2E6', // 温暖的象牙白背景
    padding: '0 16px',
    position: 'relative',
    fontSize: '14px',
    color: '#8A7D73', // 温暖的灰色
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '24px',
  },
  socialIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#EDE4D3', // 温暖的米色背景
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '18px',
    color: '#7A5638', // 温暖的古铜棕色
    '&:hover': {
      backgroundColor: '#D3A94C', // 温暖的金色悬停
      color: '#F7F2E6', // 象牙白图标
      transform: 'translateY(-2px)',
    },
  },
  tabs: {
    '& .ant-tabs-nav::before': {
      borderBottom: '1px solid #C8A04A', // 温暖的金色边框
    },
    '& .ant-tabs-tab': {
      color: '#8A7D73 !important',
      backgroundColor: 'transparent',
      boxShadow: 'none !important',
      '&:hover': {
        color: '#7A5638 !important',
        backgroundColor: 'transparent',
        boxShadow: 'none !important',
      },
    },
    '& .ant-tabs-tab-btn': {
      color: '#8A7D73 !important',
    },
    '& .ant-tabs-tab-active .ant-tabs-tab-btn': {
      color: '#7A5638 !important',
      backgroundColor: 'transparent',
      boxShadow: 'none !important',
    },
    '& .ant-tabs-ink-bar': {
      backgroundColor: '#7A5638',
    },
    '& .ant-tabs-content': {
      backgroundColor: 'transparent',
    },
  },
  mobileLogo: {
    display: 'none', // 始终隐藏mobileLogo，只使用brandHeader
    '@media (max-width: 768px)': {
      display: 'none', // 移动端也隐藏
    },
  },
  mobileLogoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#7A5638', // 温暖的古铜棕色，匹配传统风格
    marginLeft: '8px',
  },
}));

const LoginMessage: React.FC<{ content: string; duration?: number }> = ({
  content,
  duration = 3,
}) => {
  const [visible, setVisible] = useState(true);
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setVisible(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <Alert
      style={{ marginBottom: 24 }}
      message={`${content} (${seconds}s)`}
      type="error"
      showIcon
      closable
      onClose={() => setVisible(false)}
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      username: 'wanyj',
      password: '123456',
    });
  }, []);

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      const resp = await user_login({
        username: values.username,
        password: values.password,
      });
      const loginData = resp?.data;
      if (loginData && loginData.token) {
        localStorage.setItem('authToken', loginData.token);
        const currentUser = {
          name: loginData.username,
          userId: String(loginData.id || ''),
          access: loginData.role === 0 ? 'admin' : 'user',
        } as API.CurrentUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        flushSync(() => {
          setInitialState((s) => ({
            ...s,
            currentUser,
          }));
        });
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      const errorResult = { status: 'error', type: 'account', currentAuthority: 'guest' };
      setUserLoginState(errorResult);
      message.error('登录失败，请检查用户名或密码');
    } catch (error) {
      console.error('Login error:', error);
      message.error('登录失败，请重试！');
    }
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>

      {/* Left Panel */}
      <div className={styles.leftPanel}>
        <div className={styles.leftPanelContent}>{/* 左侧面板现在只显示背景图片 */}</div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          {/* Brand Header */}
          <div className={styles.brandHeader}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>福</div>
              <h1 className={styles.logoText}>幸运补给站</h1>
            </div>
          </div>

          <Form
            form={form}
            initialValues={{
              autoLogin: true,
              username: 'admin',
              password: '123456',
            }}
            onFinish={handleSubmit}
          >
            <Tabs
              centered
              className={styles.tabs}
              items={[
                {
                  key: 'account',
                  label: '账户密码登录',
                },
              ]}
            />

            {status === 'error' && loginType === 'account' && (
              <LoginMessage content={'请使用(admin/123456)登录'} />
            )}

            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            >
              <div className={styles.passwordWrapper}>
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  defaultValue="123456"
                  autoComplete="current-password"
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  className={styles.input}
                />
              </div>
            </Form.Item>

            <div
              style={{
                marginBottom: 12,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <div className={styles.checkboxContainer}>
                <Form.Item name="autoLogin" valuePropName="checked" noStyle>
                  <ProFormCheckbox>自动登录</ProFormCheckbox>
                </Form.Item>
              </div>
              <a
                className={styles.forgotPasswordLink}
                onClick={(e) => {
                  e.preventDefault();
                  message.info('请用默认账密登录');
                }}
              >
                忘记密码
              </a>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.loginButton}>
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.helperText}>
            如果没有账号？
            <a
              href="#"
              className={styles.createAccountLink}
              onClick={(e) => {
                e.preventDefault();
                message.info('请用默认账密登录');
              }}
            >
              创建账号
            </a>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerText}>其他</span>
          </div>

          <div className={styles.socialIcons}>
            <div className={styles.socialIcon}>
              <AlipayCircleOutlined />
            </div>
            <div className={styles.socialIcon}>
              <TaobaoCircleOutlined />
            </div>
            <div className={styles.socialIcon}>
              <WeiboCircleOutlined />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
