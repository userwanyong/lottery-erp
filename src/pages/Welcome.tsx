import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: React.ReactNode;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        了解更多 {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用 营动空间
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            营动空间 是一个整合 抽奖/积分/兑换/返利 等功能的平台
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <InfoCard
              index={1}
              href=""
              title="快速使用（帮你快速创建一个抽奖活动，简单）"
              desc={
                <>
                  <div style={{ marginLeft: 8, fontWeight: 'bold', fontSize: '16px',marginBottom: 5 }}>
                    快捷配置
                  </div>
                  <a
                    href="/lottery/award"
                    // target="_blank" //打开新页面
                    style={{ marginLeft: 8 }}
                  >
                    1.添加全局奖品
                  </a>
                  <br />
                  <a
                    href="/strategy/award"
                    // target="_blank" //打开新页面
                    style={{ marginLeft: 8 }}
                  >
                    2.配置抽奖奖品
                  </a>
                  (策略ID请选择默认策略、奖品规则ID请选择默认规则)
                  <br />
                  <a
                    href="/admin/activity"
                    // target="_blank" //打开新页面
                    style={{ marginLeft: 8 }}
                  >
                    3.创建活动
                  </a>
                  (抽奖策略ID请选择默认策略)
                  <br />
                  <a
                    href="/rebate/behavior_rebate"
                    // target="_blank" //打开新页面
                    style={{ marginLeft: 8 }}
                  >
                    4.配置初始抽奖次数
                  </a>
                  (行为类型请选择活动赠送、返利类型请选择抽奖次数-活动赠送、返利配置即为单次赠送的次数)
                  <br />
                </>
              }
            />
            <InfoCard
              index={2}
              href=""
              title="高级使用（新创建或基于已有的资源进行创建配置，复杂）"
              desc={
                <>
                  <div style={{marginLeft: 8, fontWeight: 'bold', fontSize: '16px',marginBottom: 5}}>
                    抽奖配置
                  </div>
                  <a
                    href="/lottery/award"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    1.添加全局奖品
                  </a>
                  <br/>
                  <a
                    href="/strategy/rule"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    2.创建抽奖策略规则
                  </a>
                  <br/>
                  <a
                    href="/strategy/strategy"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    3.创建抽奖策略
                  </a>
                  <br/>
                  <a
                    href="/strategy/tree"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    4.创建奖品规则树
                  </a>
                  <br/>
                  <a
                    href="/strategy/node"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    5.创建奖品规则节点
                  </a>
                  <br/>
                  <a
                    href="/strategy/line"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    6.串联奖品规则节点
                  </a>
                  <br/>
                  <a
                    href="/strategy/award"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    7.配置抽奖奖品
                  </a>
                  <br/>
                  <a
                    href="/admin/activity"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    8.创建活动
                  </a>
                  <br/>
                  <a
                    href="/rebate/behavior_rebate"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    9.配置初始抽奖次数
                  </a>
                  <br/>
                  <br/>
                  <div style={{marginLeft: 8, fontWeight: 'bold', fontSize: '16px',marginBottom: 5}}>
                    返利配置
                  </div>
                  <a
                    href="/rebate/activity_count"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    1.配置返利抽奖次数
                  </a>
                  <br/>
                  <a
                    href="/rebate/activity_sku"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    2.配置积分兑换返利
                  </a>
                  <br/>
                  <a
                    href="/rebate/behavior_rebate"
                    // target="_blank" //打开新页面
                    style={{marginLeft: 8}}
                  >
                    3.配置每日签到返利
                  </a>
                  <br/>
                </>
              }
            />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default Welcome;
