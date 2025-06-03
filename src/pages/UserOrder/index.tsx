import { query_user_order } from '@/services/api';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React from 'react';

const UserOrder: React.FC = () => {
  const columns: ProColumns<API.UserOrderItem>[] = [
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
      title: '活动名称',
      dataIndex: 'activityName',
      valueType: 'textarea',
    },
    {
      title: '抽奖策略',
      dataIndex: 'strategyId',
      valueType: 'textarea',
    },
    {
      title: '订单ID',
      dataIndex: 'orderId',
      valueType: 'textarea',
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      valueType: 'textarea',
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      valueType: 'textarea',
    },
    {
      title: '订单状态',
      dataIndex: 'orderState',
      valueType: 'textarea',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserOrderItem, API.PageParams> request={query_user_order} columns={columns}></ProTable>
    </PageContainer>
  );
};

export default UserOrder;
