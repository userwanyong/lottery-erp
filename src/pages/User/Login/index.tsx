import {
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Helmet, history, useModel } from '@umijs/max';
import { message, Button, Input, Form, Tabs } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import {
  user_email_login,
  user_email_register,
  user_send_email_code,
} from '@/services/api';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(() => ({
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F7F2E6',
  },
  leftPanel: {
    flex: 0.83,
    backgroundColor: '#EFE7DB',
    backgroundImage: 'url(https://wanyj-xybjz.oss-cn-beijing.aliyuncs.com/beijingtu.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0',
    position: 'relative',
    minHeight: '100vh',
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
      display: 'none',
    },
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: '#F7F2E6',
    '@media (max-width: 768px)': {
      flex: 'none',
      width: '100%',
      padding: '16px',
      minHeight: '100vh',
    },
  },
  loginCard: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#F7F2E6',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(139, 69, 19, 0.15)',
    padding: '24px 36px',
  },
  brandHeader: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7A5638',
    color: '#F7F2E6',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  logoText: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#7A5638',
  },
  input: {
    height: '48px',
    borderRadius: '8px',
    border: '1px solid #C8A04A',
    backgroundColor: '#F7F2E6',
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
    '& .ant-input': {
      backgroundColor: 'transparent',
    },
    '& .ant-input:focus': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
    '&:hover .ant-input': {
      backgroundColor: 'transparent',
    },
    '&.ant-input-affix-wrapper-status-error, &.ant-input-status-error': {
      backgroundColor: '#F7F2E6 !important',
      boxShadow: 'none !important',
    },
    '&.ant-input-affix-wrapper-status-error:hover, &.ant-input-status-error:hover': {
      backgroundColor: '#F7F2E6 !important',
      boxShadow: 'none !important',
    },
    '&.ant-input-affix-wrapper-status-error.ant-input-affix-wrapper-focused, &.ant-input-status-error.ant-input-affix-wrapper-focused':
      {
        backgroundColor: '#F7F2E6 !important',
        boxShadow: 'none !important',
      },
    '&.ant-input-affix-wrapper-status-error .ant-input, &.ant-input-status-error .ant-input': {
      backgroundColor: 'transparent !important',
    },
  },
  tabs: {
    '& .ant-tabs-nav::before': {
      borderBottom: '1px solid #C8A04A',
    },
    '& .ant-tabs-tab': {
      color: '#3A2A1C',
    },
    '& .ant-tabs-tab:hover': {
      color: '#7A5638',
    },
    '& .ant-tabs-tab-active .ant-tabs-tab-btn': {
      color: '#7A5638 !important',
      fontWeight: 600,
    },
    '& .ant-tabs-ink-bar': {
      backgroundColor: '#7A5638',
    },
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  forgotPasswordLink: {
    color: '#7A5638',
    fontSize: '14px',
    textDecoration: 'none',
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
  },
  captchaButton: {
    borderRadius: '6px',
    backgroundColor: '#7A5638 !important',
    borderColor: '#7A5638 !important',
    color: '#F7F2E6 !important',
    height: '32px',
    padding: '0 10px',
  },
  helperText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#8A7D73',
  },
}));

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'emailLogin' | 'emailRegister'>('emailLogin');
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [codeCooldown, setCodeCooldown] = useState(0);
  const { setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      password: '',
    });
  }, [form]);

  useEffect(() => {
    if (codeCooldown <= 0) return;
    const timer = setInterval(() => {
      setCodeCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [codeCooldown]);

  const handleLoginSuccess = (resp: any) => {
    const loginData = (resp?.data ?? resp) as any;
    if (!loginData?.accessToken) {
      message.error(resp?.message || '登录失败，请检查输入信息');
      return false;
    }

    localStorage.setItem('authToken', loginData.accessToken);
    localStorage.setItem('refreshToken', loginData.refreshToken);
    localStorage.setItem('tokenExpiresAt', String(Date.now() + (loginData.expiresIn || 3600) * 1000));

    const currentUser = {
      name: loginData.username,
      userId: String(loginData.id || ''),
      access: 'admin',
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
    return true;
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      if (activeTab === 'emailLogin') {
        const resp = await user_email_login({
          email: values.email || '',
          password: values.password || '',
        });
        handleLoginSuccess(resp);
        return;
      }

      const resp = await user_email_register({
        email: values.email || '',
        passCode: values.passCode || '',
        password: values.password || '',
      });

      if (handleLoginSuccess(resp)) {
        message.success('邮箱注册成功');
      }
    } catch (error) {
      console.error('login/register error:', error);
      message.error('操作失败，请稍后重试');
    }
  };

  const sendEmailCode = async () => {
    try {
      const email = await form.validateFields(['email']).then((result) => result.email);
      setSendCodeLoading(true);
      const resp = await user_send_email_code(email);
      if (Number(resp?.code) === 1000) {
        message.success('验证码已发送，请查收邮箱');
        setCodeCooldown(60);
      } else {
        message.error(resp?.message || '验证码发送失败');
      }
    } catch (error) {
      if ((error as any)?.errorFields) {
        return;
      }
      console.error('send email code error:', error);
      message.error('验证码发送失败');
    } finally {
      setSendCodeLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>

      <div className={styles.leftPanel} />

      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <div className={styles.brandHeader}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>福</div>
              <h1 className={styles.logoText}>幸运补给站</h1>
            </div>
          </div>

          <Form
            form={form}
            onFinish={handleSubmit}
          >
            <Tabs
              centered
              className={styles.tabs}
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key as 'emailLogin' | 'emailRegister');
                form.resetFields(['password', 'passCode']);
              }}
              items={[
                { key: 'emailLogin', label: '邮箱登录' },
                { key: 'emailRegister', label: '邮箱注册' },
              ]}
            />

            {(activeTab === 'emailLogin' || activeTab === 'emailRegister') && (
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '邮箱是必填项' },
                  { type: 'email', message: '邮箱格式不正确' },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="请输入邮箱"
                  className={styles.input}
                />
              </Form.Item>
            )}

            {activeTab === 'emailRegister' && (
              <Form.Item
                name="passCode"
                rules={[{ required: true, message: '验证码是必填项' }]}
              >
                <Input
                  size="large"
                  prefix={<SafetyCertificateOutlined />}
                  placeholder="请输入验证码"
                  className={styles.input}
                  suffix={
                    <Button
                      type="primary"
                      size="small"
                      className={styles.captchaButton}
                      loading={sendCodeLoading}
                      disabled={codeCooldown > 0}
                      onClick={sendEmailCode}
                    >
                      {codeCooldown > 0 ? `${codeCooldown}s` : '发送验证码'}
                    </Button>
                  }
                />
              </Form.Item>
            )}

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '密码是必填项' },
                ...(activeTab === 'emailRegister' ? [{ min: 6, message: '密码至少 6 位' }] : []),
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder={activeTab === 'emailRegister' ? '请输入用于登录的新密码' : '请输入密码'}
                autoComplete="current-password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                className={styles.input}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.loginButton}>
                {activeTab === 'emailRegister' ? '注册并登录' : '登录'}
              </Button>
            </Form.Item>
          </Form>

          {activeTab === 'emailRegister' && (
            <div className={styles.helperText}>注册成功后将自动完成登录</div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
