import { GithubOutlined } from '@ant-design/icons';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        paddingBlock: 16,
        color: 'rgba(0, 0, 0, 0.45)',
        fontSize: 14,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <span style={{ marginRight: 12 }}>幸运补给站</span>
        <a
          href="https://github.com/userwanyong"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'inherit' }}
        >
          <GithubOutlined />
        </a>
      </div>
      <div>
        <span style={{ marginRight: 4 }}>©</span>
        <a
          href="https://www.wanyj.cn/"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'inherit' }}
        >
          wanyj
        </a>
      </div>
    </div>
  );
};

export default Footer;
