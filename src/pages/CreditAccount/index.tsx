import { query_credit_account } from '@/services/api';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React from 'react';

const CreditAccount: React.FC = () => {
  const columns: ProColumns<API.CreditAccountItem>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      valueType: 'textarea',
    },
    {
      title: '总积分',
      dataIndex: 'totalAmount',
      valueType: 'textarea',
    },
    {
      title: '可用积分',
      dataIndex: 'availableAmount',
      valueType: 'textarea',
    },
    {
      title: '账户状态',
      dataIndex: 'accountStatus',
      valueEnum: {
        open: {
          text: '正常',
          status: 'Success',
        },
        close: {
          text: '冻结',
          status: 'Error',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.CreditAccountItem, API.PageParams>
        rowKey="userId"
        request={query_credit_account}
        columns={columns}
      ></ProTable>
    </PageContainer>
  );
};

export default CreditAccount;
