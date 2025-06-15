import { query_user_award_record } from '@/services/api';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React from 'react';

const UserAwardRecord: React.FC = () => {
  const columns: ProColumns<API.UserAwardRecordItem>[] = [
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
      title: '抽奖策略ID',
      dataIndex: 'strategyId',
      valueType: 'textarea',
    },
    {
      title: '抽奖单ID',
      dataIndex: 'userOrderId',
      valueType: 'textarea',
    },
    {
      title: '奖品ID',
      dataIndex: 'awardId',
      valueType: 'textarea',
    },
    {
      title: '奖品标题',
      dataIndex: 'awardTitle',
      valueType: 'textarea',
    },
    {
      title: '中奖时间',
      dataIndex: 'awardTime',
      valueType: 'dateTime',
    },
    {
      title: '奖品状态',
      dataIndex: 'awardState',
      valueEnum: {
        create: {
          text: '待发放',
          status: 'Processing',
        },
        complete: {
          text: '已发放',
          status: 'Success',
        },
        fail: {
          text: '发放失败',
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
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserAwardRecordItem, API.PageParams>
        rowKey="userOrderId"
        request={query_user_award_record}
        columns={columns}
      ></ProTable>
    </PageContainer>
  );
};

export default UserAwardRecord;
