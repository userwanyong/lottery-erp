import { query_credit_record } from '@/services/api';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React from 'react';

const CreditRecord: React.FC = () => {
  const columns: ProColumns<API.CreditRecordItem>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      valueType: 'textarea',
    },
    {
      title: '交易名称',
      dataIndex: 'tradeName',
      valueType: 'textarea',
    },
    {
      title: '交易类型',
      dataIndex: 'tradeType',
      valueType: 'textarea',
    },
    {
      title: '交易积分',
      dataIndex: 'tradeAmount',
      valueType: 'textarea',
    },
    {
      title: '业务ID',
      dataIndex: 'outBusinessNo',
      valueType: 'textarea',
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
      <ProTable<API.CreditRecordItem, API.PageParams>
        rowKey="outBusinessNo"
        request={query_credit_record}
        columns={columns}
      ></ProTable>
    </PageContainer>
  );
};

export default CreditRecord;
