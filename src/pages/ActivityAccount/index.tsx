import { query_activity_account } from '@/services/api';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React from 'react';

const ActivityAccount: React.FC = () => {
  const columns: ProColumns<API.ActivityAccountItem>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      valueType: 'textarea',
    },
    {
      title: '活动ID',
      dataIndex: 'activityId',
      valueType: 'textarea',
    },
    {
      title: '总次数',
      dataIndex: 'totalCount',
      valueType: 'textarea',
    },
    {
      title: '剩余总次数',
      dataIndex: 'totalCountSurplus',
      valueType: 'textarea',
    },
    {
      title: '月次数',
      dataIndex: 'monthCount',
      valueType: 'textarea',
    },
    {
      title: '剩余月次数',
      dataIndex: 'monthCountSurplus',
      valueType: 'textarea',
    },
    {
      title: '日次数',
      dataIndex: 'dayCount',
      valueType: 'textarea',
    },
    {
      title: '剩余日次数',
      dataIndex: 'dayCountSurplus',
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
      <ProTable<API.ActivityAccountItem, API.PageParams>
        rowKey="userId"
        request={query_activity_account}
        columns={columns}
      ></ProTable>
    </PageContainer>
  );
};

export default ActivityAccount;
