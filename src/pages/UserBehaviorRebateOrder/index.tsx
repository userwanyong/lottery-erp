import {query_user_behavior_rebate_order, query_user_order} from '@/services/api';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React from 'react';

const UserBehaviorRebateOrder: React.FC = () => {
  const columns: ProColumns<API.UserOrderItem>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      valueType: 'textarea',
    },
    {
      title: '返利类型',
      dataIndex: 'behaviorType',
      valueType: 'textarea',
    },
    {
      title: '返利描述',
      dataIndex: 'rebateDesc',
      valueType: 'textarea',
    },
    {
      title: '返利配置',
      dataIndex: 'rebateConfig',
      valueType: 'textarea',
    },
    {
      title: '业务ID',
      dataIndex: 'bizId',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserOrderItem, API.PageParams>
        rowKey="createTime"
        request={query_user_behavior_rebate_order}
        columns={columns}
      ></ProTable>
    </PageContainer>
  );
};

export default UserBehaviorRebateOrder;
