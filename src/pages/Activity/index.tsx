import React, { useState } from 'react';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { query_activity } from '@/services/api';
import AddForm from './compoents/AddForm';
import { Button } from 'antd';

const Activity: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const columns: ProColumns<API.ActivityItem>[] = [
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
      title: '活动描述',
      dataIndex: 'activityDesc',
      valueType: 'textarea',
    },
    {
      title: '开始时间',
      dataIndex: 'beginDateTime',
      valueType: 'dateTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endDateTime',
      valueType: 'dateTime',
    },
    {
      title: '抽奖策略ID',
      dataIndex: 'strategyId',
      valueType: 'textarea',
    },
    {
      title: '活动状态',
      dataIndex: 'state',
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
      <ProTable<API.ActivityItem, API.PageParams>
        rowKey="userId"
        request={query_activity}
        columns={columns}
        toolbar={{
          actions: [
            <Button
              key="add"
              type="primary"
              onClick={() => setModalVisible(true)}
            >
              + 新建活动
            </Button>,
          ],
        }}
      />
      <AddForm visible={modalVisible} onVisibleChange={setModalVisible} />
    </PageContainer>
  );
};

export default Activity;
