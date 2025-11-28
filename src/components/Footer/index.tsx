import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'xybjz',
          title: '幸运补给站',
          href: '',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/userwanyong',
          blankTarget: true,
        },
        {
          key: 'wanyj',
          title: 'wanyj',
          href: 'https://www.wanyj.cn/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
