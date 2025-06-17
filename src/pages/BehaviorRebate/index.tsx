import { delete_behavior_rebate, query_behavior_rebate } from '@/services/api';
import { ProDescriptions } from '@ant-design/pro-components';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { App, Button, Drawer, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import AddForm from './compoents/AddForm';
import UpdateForm from './compoents/UpdateForm';

const BehaviorRebate: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false); // 控制修改表单可见性
  const [currentRow, setCurrentRow] = useState<API.BehaviorRebateItem>(); // 存储当前编辑行的数据
  const [showDetail, setShowDetail] = useState<boolean>(false); // 控制详情抽屉可见性
  const actionRef = useRef<ActionType>();
  const { message: msg } = App.useApp(); // 获取 Ant Design 的 message 实例

  const handleDelete = async (record: { id: any }) => {
    try {
      const res = await delete_behavior_rebate(record);
      if (res.code === 1000) {
        msg.success('删除成功');
        actionRef.current?.reload();
      } else {
        msg.error('删除失败');
      }
    } catch (error) {
      msg.error('删除失败，请重试');
    }
  };

  const columns: ProColumns<API.BehaviorRebateItem>[] = [
    {
      title: '返利ID',
      dataIndex: 'id',
      valueType: 'textarea',
      render: (dom, entity) => {
        return (
          <a
            style={{ color: '#0862ec' }}
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '活动ID',
      dataIndex: 'activityId',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '行为类型',
      dataIndex: 'behaviorType',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '返利描述',
      dataIndex: 'rebateDesc',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '返利类型',
      dataIndex: 'rebateType',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '返利配置',
      dataIndex: 'rebateConfig',
      valueType: 'textarea',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: {
        open: {
          text: '开启',
          status: 'Success',
        },
        close: {
          text: '关闭',
          status: 'Error',
        },
      },
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除该活动次数配置吗？"
          onConfirm={() => handleDelete(record.id as any)}
          okText="是"
          cancelText="否"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const descriptionColumns: ProDescriptionsItemProps<API.ActivitySkuItem>[] = [
    {
      title: '返利ID',
      dataIndex: 'id',
    },
    {
      title: '活动ID',
      dataIndex: 'activityId',
    },
    {
      title: '行为类型',
      dataIndex: 'behaviorType',
    },
    {
      title: '返利描述',
      dataIndex: 'rebateDesc',
    },
    {
      title: '返利类型',
      dataIndex: 'rebateType',
    },
    {
      title: '返利配置',
      dataIndex: 'rebateConfig',
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueEnum: {
        open: {
          text: '开启',
          status: 'Success',
        },
        close: {
          text: '关闭',
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
      <ProTable<API.BehaviorRebateItem, API.PageParams>
        headerTitle="活动次数配置列表"
        actionRef={actionRef}
        rowKey="id"
        request={query_behavior_rebate}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            + 新建配置
          </Button>,
        ]}
      />
      <AddForm
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        onFinish={() => actionRef.current?.reload()}
      />
      <UpdateForm
        visible={updateModalVisible}
        onVisibleChange={setUpdateModalVisible}
        onFinish={() => actionRef.current?.reload()}
        initialValues={currentRow || {}}
      />
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow && (
          <ProDescriptions<API.ActivitySkuItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={descriptionColumns}
            extra={[
              <a
                key="update"
                onClick={() => {
                  setUpdateModalVisible(true);
                  setShowDetail(false); // 关闭详情抽屉
                }}
              >
                修改
              </a>,
              <Popconfirm
                key="delete"
                title="确定删除该活动次数配置吗？"
                onConfirm={() => {
                  handleDelete(currentRow?.id as any);
                  setShowDetail(false); // 关闭详情抽屉
                }}
                okText="是"
                cancelText="否"
              >
                <a>删除</a>
              </Popconfirm>,
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default BehaviorRebate;
