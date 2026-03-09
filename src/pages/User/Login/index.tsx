import {
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  WechatOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Helmet, history, useModel } from '@umijs/max';
import { message, Button, Input, Form, Tabs, Spin } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  user_email_login,
  user_email_register,
  user_send_email_code,
  wechat_miniapp_qrcode_login,
  wechat_miniapp_qrcode,
  wechat_miniapp_qrcode_status,
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
  recommendedTabLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  recommendedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30px',
    height: '18px',
    padding: '0 6px',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #B57A2E 0%, #D4A24C 100%)',
    color: '#FFF7E8',
    fontSize: '11px',
    lineHeight: 1,
    fontWeight: 600,
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
  qrcodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
  },
  qrcodeWrapper: {
    position: 'relative',
    width: '200px',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(122, 86, 56, 0.1)',
  },
  qrcodeOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(247, 242, 230, 0.9)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  qrcodeStatusText: {
    fontSize: '14px',
    color: '#7A5638',
    fontWeight: 500,
  },
  qrcodeRefreshBtn: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#7A5638',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '&:hover': {
      color: '#5A3D28',
    },
  },
  qrcodeHelperText: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '13px',
    color: '#8A7D73',
  },
  qrcodeScanUser: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  qrcodeScanAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid rgba(122, 86, 56, 0.18)',
  },
}));

type WechatQrcodeData = {
  qrcodeId?: string;
  qrCodeUrl?: string;
  qrcodeUrl?: string;
  qrcodeContent?: string;
  status?: string;
  ticket?: string;
  displayName?: string;
  photo?: string;
};

const normalizeWechatQrcodeStatus = (
  backendStatus?: string,
): 'pending' | 'scanned' | 'confirmed' | 'expired' => {
  const statusUpper = backendStatus?.toUpperCase();
  if (statusUpper === 'PENDING' || statusUpper === 'WAITING') {
    return 'pending';
  }
  if (statusUpper === 'SCANNED' || statusUpper === 'SCANED') {
    return 'scanned';
  }
  if (statusUpper === 'CONFIRMED' || statusUpper === 'AUTHORIZED') {
    return 'confirmed';
  }
  if (statusUpper === 'EXPIRED' || statusUpper === 'CANCELED') {
    return 'expired';
  }
  return 'pending';
};

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'wechatLogin' | 'emailLogin' | 'emailRegister'>('wechatLogin');
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [codeCooldown, setCodeCooldown] = useState(0);

  // 微信扫码登录相关状态
  const [qrcodeId, setQrcodeId] = useState<string>('');
  const [qrcodeUrl, setQrcodeUrl] = useState<string>('');
  const [qrcodeContent, setQrcodeContent] = useState<string>('');
  const [qrcodeStatus, setQrcodeStatus] = useState<'pending' | 'scanned' | 'confirmed' | 'expired'>('pending');
  const [qrcodeLoading, setQrcodeLoading] = useState(false);
  const [qrcodeLoginLoading, setQrcodeLoginLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [scannedDisplayName, setScannedDisplayName] = useState('');
  const [scannedPhoto, setScannedPhoto] = useState('');
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const qrcodeStatusRef = useRef<'pending' | 'scanned' | 'confirmed' | 'expired'>('pending');
  const wechatLoginSubmittingRef = useRef(false);

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

  useEffect(() => {
    qrcodeStatusRef.current = qrcodeStatus;
  }, [qrcodeStatus]);

  const handleLoginSuccess = (resp: any) => {
    const loginData = (resp?.data ?? resp) as any;
    if (!loginData?.accessToken) {
      message.error(resp?.message || '登录失败，未获取到访问令牌');
      return false;
    }
    if (!loginData?.id) {
      message.error('登录失败，用户信息不完整');
      return false;
    }

    localStorage.setItem('authToken', loginData.accessToken);
    localStorage.setItem('refreshToken', loginData.refreshToken || '');
    localStorage.setItem('tokenExpiresAt', String(Date.now() + (loginData.expiresIn || 3600) * 1000));

    const currentUser = {
      name: loginData.username || '用户',
      userId: String(loginData.id),
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
    const redirectUrl = urlParams.get('redirect') || '/';
    setTimeout(() => {
      history.push(redirectUrl);
    }, 100);
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
      message.error('验证码发送失败');
    } finally {
      setSendCodeLoading(false);
    }
  };

  // 生成微信登录二维码
  const generateQrcode = async () => {
    setImageLoadError(false);
    setQrcodeUrl('');
    setQrcodeContent('');
    setScannedDisplayName('');
    setScannedPhoto('');
    setQrcodeLoginLoading(false);
    wechatLoginSubmittingRef.current = false;

    try {
      setQrcodeLoading(true);
      setQrcodeStatus('pending');
      const resp = await wechat_miniapp_qrcode();
      const qrcodeData = (resp?.data ?? resp) as WechatQrcodeData;
      const qrCodeUrl = qrcodeData?.qrCodeUrl || qrcodeData?.qrcodeUrl;

      if (qrcodeData?.qrcodeId) {
        setQrcodeId(qrcodeData.qrcodeId);

        if (qrcodeData.status) {
          setQrcodeStatus(normalizeWechatQrcodeStatus(qrcodeData.status));
        }

        if (qrCodeUrl) {
          setQrcodeUrl(qrCodeUrl);
        } else if (qrcodeData.qrcodeContent) {
          setQrcodeContent(qrcodeData.qrcodeContent);
        } else {
          message.error('二维码数据格式错误');
        }

        setQrcodeLoading(false);
        startPolling(qrcodeData.qrcodeId);
      } else {
        message.error(resp?.message || '二维码生成失败');
        setQrcodeLoading(false);
      }
    } catch (error) {
      message.error('二维码生成失败，请稍后重试');
      setQrcodeLoading(false);
    }
  };

  // 停止轮询
  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const loginByWechatTicket = async (ticket: string) => {
    if (!ticket || wechatLoginSubmittingRef.current) {
      return;
    }

    wechatLoginSubmittingRef.current = true;
    setQrcodeLoginLoading(true);

    try {
      const resp = await wechat_miniapp_qrcode_login(ticket);
      const loginResult = handleLoginSuccess(resp);
      if (loginResult) {
        message.success('微信登录成功');
      } else {
        wechatLoginSubmittingRef.current = false;
        setQrcodeLoginLoading(false);
      }
    } catch (error) {
      wechatLoginSubmittingRef.current = false;
      setQrcodeLoginLoading(false);
      setQrcodeStatus('expired');
      message.error('微信登录失败，请重新扫码');
    }
  };

  // 开始轮询二维码状态
  const startPolling = (id: string) => {
    stopPolling(); // 先停止之前的轮询

    pollTimerRef.current = setInterval(async () => {
      try {
        const resp = await wechat_miniapp_qrcode_status(id);
        const statusData = (resp?.data ?? resp) as WechatQrcodeData;

        if (statusData?.status) {
          const normalizedStatus = normalizeWechatQrcodeStatus(statusData.status);

          if (normalizedStatus !== qrcodeStatusRef.current) {
            setQrcodeStatus(normalizedStatus);
          }

          if (normalizedStatus === 'scanned') {
            setScannedDisplayName(statusData.displayName || '');
            setScannedPhoto(statusData.photo || '');
          }

          if (normalizedStatus === 'confirmed') {
            stopPolling();
            if (statusData.ticket) {
              await loginByWechatTicket(statusData.ticket);
            } else {
              setQrcodeLoginLoading(false);
              wechatLoginSubmittingRef.current = false;
              message.error('扫码已确认，但未获取到登录凭证，请重新扫码');
            }
          } else if (normalizedStatus === 'expired') {
            stopPolling();
            setQrcodeLoginLoading(false);
            wechatLoginSubmittingRef.current = false;
          }
        }
      } catch (error) {
        // Silently handle polling errors
      }
    }, 2000); // 每2秒轮询一次
  };

  // 当切换到微信登录 tab 时自动生成二维码
  useEffect(() => {
    if (activeTab === 'wechatLogin') {
      generateQrcode();
    } else {
      // 切换离开时停止轮询
      stopPolling();
      setQrcodeId('');
      setQrcodeUrl('');
      setQrcodeContent('');
      setQrcodeStatus('pending');
      setQrcodeLoginLoading(false);
      setImageLoadError(false);
      setScannedDisplayName('');
      setScannedPhoto('');
      wechatLoginSubmittingRef.current = false;
    }

    return () => {
      stopPolling();
    };
  }, [activeTab]);


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
                setActiveTab(key as 'wechatLogin' | 'emailLogin' | 'emailRegister');
                form.resetFields(['password', 'passCode']);
              }}
              items={[
                {
                  key: 'wechatLogin',
                  label: (
                    <span className={styles.recommendedTabLabel}>
                      <span>微信登录</span>
                      <span className={styles.recommendedBadge}>推荐</span>
                    </span>
                  ),
                },
                { key: 'emailLogin', label: '邮箱登录' },
                { key: 'emailRegister', label: '邮箱注册' },
              ]}
            />

            {activeTab !== 'wechatLogin' && (
              <>
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
                    placeholder={activeTab === 'emailRegister' ? '请设置用于登录的密码' : '请输入密码'}
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
              </>
            )}
          </Form>

          {activeTab === 'emailLogin' && (
            <div className={styles.helperText}>首次登录请先使用邮箱注册</div>
          )}

          {activeTab === 'emailRegister' && (
            <div className={styles.helperText}>注册成功后将自动完成登录</div>
          )}

          {activeTab === 'wechatLogin' && (
            <div className={styles.qrcodeContainer}>
              <div className={styles.qrcodeWrapper}>
                {qrcodeLoading ? (
                  <Spin size="large" />
                ) : qrcodeUrl ? (
                  <>
                    <img
                      src={qrcodeUrl}
                      alt="微信登录二维码"
                      style={{ width: '168px', height: '168px' }}
                      onLoad={() => {
                        setImageLoadError(false);
                      }}
                      onError={() => {
                        setImageLoadError(true);
                        message.error('二维码图片加载失败');
                      }}
                    />
                    {imageLoadError && (
                      <div className={styles.qrcodeOverlay}>
                        <span className={styles.qrcodeStatusText}>二维码加载失败</span>
                        <div
                          className={styles.qrcodeRefreshBtn}
                          onClick={generateQrcode}
                        >
                          <ReloadOutlined />
                          点击重试
                        </div>
                      </div>
                    )}
                    {!imageLoadError && qrcodeStatus !== 'pending' && (
                      <div className={styles.qrcodeOverlay}>
                        {qrcodeStatus === 'scanned' && (
                          <div className={styles.qrcodeScanUser}>
                            {scannedPhoto ? (
                              <img src={scannedPhoto} alt="扫码用户头像" className={styles.qrcodeScanAvatar} />
                            ) : (
                              <WechatOutlined style={{ fontSize: '32px', color: '#07C160' }} />
                            )}
                            <span className={styles.qrcodeStatusText}>
                              {scannedDisplayName ? `${scannedDisplayName} 已扫码` : '已扫码'}
                            </span>
                            <span className={styles.qrcodeStatusText}>请在手机上确认登录</span>
                          </div>
                        )}
                        {qrcodeStatus === 'confirmed' && (
                          <>
                            <Spin size="large" />
                            <span className={styles.qrcodeStatusText}>确认成功，正在登录...</span>
                          </>
                        )}
                        {qrcodeStatus === 'expired' && (
                          <>
                            <span className={styles.qrcodeStatusText}>二维码已过期</span>
                            <div
                              className={styles.qrcodeRefreshBtn}
                              onClick={generateQrcode}
                            >
                              <ReloadOutlined />
                              点击刷新
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : qrcodeContent ? (
                  <>
                    <QRCodeSVG
                      value={qrcodeContent}
                      size={168}
                      level="M"
                    />
                    {qrcodeStatus !== 'pending' && (
                      <div className={styles.qrcodeOverlay}>
                        {qrcodeStatus === 'scanned' && (
                          <div className={styles.qrcodeScanUser}>
                            {scannedPhoto ? (
                              <img src={scannedPhoto} alt="扫码用户头像" className={styles.qrcodeScanAvatar} />
                            ) : (
                              <WechatOutlined style={{ fontSize: '32px', color: '#07C160' }} />
                            )}
                            <span className={styles.qrcodeStatusText}>
                              {scannedDisplayName ? `${scannedDisplayName} 已扫码` : '已扫码'}
                            </span>
                            <span className={styles.qrcodeStatusText}>请在手机上确认登录</span>
                          </div>
                        )}
                        {qrcodeStatus === 'confirmed' && (
                          <>
                            <Spin size="large" />
                            <span className={styles.qrcodeStatusText}>确认成功，正在登录...</span>
                          </>
                        )}
                        {qrcodeStatus === 'expired' && (
                          <>
                            <span className={styles.qrcodeStatusText}>二维码已过期</span>
                            <div
                              className={styles.qrcodeRefreshBtn}
                              onClick={generateQrcode}
                            >
                              <ReloadOutlined />
                              点击刷新
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <Spin size="large" />
                )}
              </div>
              <div className={styles.qrcodeHelperText}>
                {qrcodeStatus === 'pending' && '请使用微信扫描二维码登录'}
                {qrcodeStatus === 'scanned' && '扫码成功，请在手机上确认登录'}
                {qrcodeStatus === 'confirmed' &&
                  (qrcodeLoginLoading ? '已确认，正在完成登录...' : '已确认，请稍候...')}
                {qrcodeStatus === 'expired' && '二维码已过期，请点击刷新'}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
