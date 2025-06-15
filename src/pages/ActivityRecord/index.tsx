import { query_activity_record } from '@/services/api';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React from 'react';

const ActivityRecord: React.FC = () => {
  const columns: ProColumns<API.ActivityRecordItem>[] = [
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
      title: 'sku',
      dataIndex: 'sku',
      valueType: 'textarea',
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      valueType: 'textarea',
    },
    {
      title: '策略ID',
      dataIndex: 'strategyId',
      valueType: 'textarea',
    },
    {
      title: '总次数',
      dataIndex: 'totalCount',
      valueType: 'textarea',
    },
    {
      title: '日次数',
      dataIndex: 'dayCount',
      valueType: 'textarea',
    },
    {
      title: '月次数',
      dataIndex: 'monthCount',
      valueType: 'textarea',
    },
    {
      title: '对换所支付积分',
      dataIndex: 'payAmount',
      valueType: 'textarea',
    },
    {
      title: '订单状态',
      dataIndex: 'state',
      valueEnum: {
        completed: {
          text: '已完成',
          status: 'Success',
        },
        wait_pay: {
          text: '待支付',
          status: 'Warning',
        },
      },
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
      <ProTable<API.ActivityRecordItem, API.PageParams>
        rowKey="outBusinessNo"
        request={query_activity_record}
        columns={columns}
      ></ProTable>
    </PageContainer>
  );
};

export default ActivityRecord;
